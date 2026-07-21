import {
    ChangeEventHandler,
    FormEventHandler,
    KeyboardEventHandler,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { Check, Mic, Paperclip, SendHorizontal, Video, X } from 'lucide-react';
import { Dialog } from 'radix-ui';

import { Button } from '@/components/Button';
import { formatFileSize } from '@/helpers/utils';
import { useDropZone } from '@/hooks/useDropZone';
import { EmojiSuggestion, EmojiSuggestionsPopup, EmojiSuggestionsPopupHandle } from '@/pages/client/Chat/EmojiSuggestionsPopup';
import { MessageEditorAttachment } from '@/pages/client/Chat/MessageEditorAttachment';
import { VideoRecorderModal } from '@/pages/client/Chat/VideoRecorderModal';
import { VoiceRecorderModal } from '@/pages/client/Chat/VoiceRecorderModal';
import { formatTimestamp } from '@/helpers/formatTimestamp';
import { AttachmentId, Attachment } from '@/types/attachments';
import { MessageId, MessageWithUser } from '@/types/messages';

import dialogStyles from '@/components/Popup/Popup.module.css';
import styles from './MessageInput.module.css';

type EditingMessage = {
    id: MessageId;
    content: string;
    attachments: Attachment[];
};

type Props = {
    editingMessage?: EditingMessage | null;
    replyToMessage?: MessageWithUser | null;
    onSend(text: string, attachmentIds: AttachmentId[]): Promise<void>;
    onSaveEdit?(id: MessageId, text: string, attachmentIds: AttachmentId[]): Promise<void>;
    onCancelEdit?(): void;
    onClearReply?(): void;
}

type EditorAttachment = {
    kind: 'uploaded';
    attachment: Attachment;
} | {
    kind: 'pending';
    draftId: string;
    file: File;
    compress: boolean;
    asFile: boolean;
};

type EmojiQuery = {
    start: number;
    end: number;
    query: string;
};

// ":" followed by a letter/digit, then a solid run of word characters, right before the caret
const EMOJI_QUERY_PATTERN = /:([a-zA-Z0-9][a-zA-Z0-9_]*)$/;

const getEmojiQuery = (text: string, caret: number | null): EmojiQuery | null => {
    if (caret == null) {
        return null;
    }

    const match = EMOJI_QUERY_PATTERN.exec(text.slice(0, caret));
    if (!match) {
        return null;
    }

    return {
        start: caret - match[0].length,
        end: caret,
        query: match[1],
    };
};

const canCompressFile = (file: File) => file.type.startsWith('video/') || file.type.startsWith('audio/');

const canUploadAsFile = (file: File) =>
    file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/');

export function MessageInput({ editingMessage, replyToMessage, onSend, onSaveEdit, onCancelEdit, onClearReply }: Props) {
    const [isSending, setIsSending] = useState(false);
    const [text, setText] = useState('');
    const [attachments, setAttachments] = useState<EditorAttachment[]>([]);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [compressPendingFile, setCompressPendingFile] = useState(false);
    const [uploadPendingFileAsFile, setUploadPendingFileAsFile] = useState(false);
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [caret, setCaret] = useState<number | null>(null);
    const [suggestionsDismissed, setSuggestionsDismissed] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const pendingCaretRef = useRef<number | null>(null);
    const suggestionsRef = useRef<EmojiSuggestionsPopupHandle>(null);

    const isEditing = editingMessage != null;

    useEffect(() => {
        if (editingMessage) {
            setText(editingMessage.content);
            setAttachments(editingMessage.attachments.map(attachment => ({
                kind: 'uploaded',
                attachment,
            })));
        } else {
            setText('');
            setAttachments([]);
        }
        setCaret(null);
        setSuggestionsDismissed(false);
    }, [editingMessage]);

    const emojiQuery = suggestionsDismissed ? null : getEmojiQuery(text, caret);

    // a controlled input moves the caret to the end after a programmatic value change; put it back
    useLayoutEffect(() => {
        if (pendingCaretRef.current != null && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(pendingCaretRef.current, pendingCaretRef.current);
            pendingCaretRef.current = null;
        }
    }, [text]);

    const applyEmojiSuggestion = (suggestion: EmojiSuggestion) => {
        if (!emojiQuery) {
            return;
        }

        const newText = text.slice(0, emojiQuery.start) + suggestion.emoji + text.slice(emojiQuery.end);
        const newCaret = emojiQuery.start + suggestion.emoji.length;
        pendingCaretRef.current = newCaret;
        setText(newText);
        setCaret(newCaret);
    };

    // grow with the content, capped by the max-height on the textarea
    useLayoutEffect(() => {
        const el = inputRef.current;
        if (!el) {
            return;
        }
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }, [text]);

    const handleTextChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        const { value, selectionStart } = e.target;
        if (suggestionsDismissed && selectionStart != null && value[selectionStart - 1] === ':') {
            setSuggestionsDismissed(false);
        }
        setText(value);
        setCaret(selectionStart);
    };

    const handleInputKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (emojiQuery) {
            if (e.key === 'Escape') {
                e.preventDefault();
                setSuggestionsDismissed(true);
                return;
            }

            if (suggestionsRef.current?.handleKeyDown(e)) {
                e.preventDefault();
                return;
            }
        }

        if (e.key === 'Enter') {
            if (e.shiftKey || e.ctrlKey) {
                // Shift+Enter inserts a newline natively; Ctrl+Enter needs it done by hand
                if (e.ctrlKey) {
                    e.preventDefault();
                    const { selectionStart, selectionEnd } = e.currentTarget;
                    const newCaret = selectionStart + 1;
                    pendingCaretRef.current = newCaret;
                    setText(text.slice(0, selectionStart) + '\n' + text.slice(selectionEnd));
                    setCaret(newCaret);
                }
                return;
            }

            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
        }
    };

    useEffect(() => {
        if (!pendingFile) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(pendingFile);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [pendingFile]);

    const uploadedAttachments = attachments
        .filter((attachment): attachment is Extract<EditorAttachment, { kind: 'uploaded' }> => attachment.kind === 'uploaded')
        .map(({ attachment }) => attachment);
    const hasPendingAttachments = attachments.some(attachment => attachment.kind === 'pending');
    const canSend = text.trim().length > 0 || uploadedAttachments.length > 0;
    const canSubmit = canSend && !hasPendingAttachments;

    const openFilePreview = (file: File) => {
        setPendingFile(file);
        setCompressPendingFile(false);
        setUploadPendingFileAsFile(false);
    };

    const closeFilePreview = () => {
        setPendingFile(null);
    };

    const confirmPendingFile = () => {
        if (!pendingFile) {
            return;
        }

        const file = pendingFile;
        const shouldCompress = !uploadPendingFileAsFile && compressPendingFile && canCompressFile(file);
        const asFile = uploadPendingFileAsFile && canUploadAsFile(file);
        closeFilePreview();
        setAttachments(list => [
            ...list,
            {
                kind: 'pending',
                draftId: crypto.randomUUID(),
                file,
                compress: shouldCompress,
                asFile,
            },
        ]);
    };

    const { onClick: onFileSelectClick } = useDropZone({
        onDrop: openFilePreview,
    });

    const handleMediaRecorded = useCallback((file: File) => {
        setAttachments(list => [
            ...list,
            {
                kind: 'pending',
                draftId: crypto.randomUUID(),
                file,
                compress: true,
                asFile: false,
            },
        ]);
    }, []);

    const handleSend: FormEventHandler = async (e) => {
        e.preventDefault();
        if (isSending || !canSubmit) {
            return;
        }
        setIsSending(true);
        try {
            if (isEditing && onSaveEdit) {
                await onSaveEdit(editingMessage.id, text, uploadedAttachments.map(a => a.id));
            } else {
                await onSend(text, uploadedAttachments.map(a => a.id));
                setText('');
                setAttachments([]);
            }
            setCaret(null);
            setSuggestionsDismissed(false);
        } catch (_e) {
            // TODO
        } finally {
            setIsSending(false);
        }
    };

    const handleDeleteAttachment = useCallback((attachmentId: AttachmentId) => {
        setAttachments(list => list.filter(att => att.kind !== 'uploaded' || att.attachment.id !== attachmentId));
    }, []);

    const handleDeleteDraftAttachment = useCallback((draftId: string) => {
        setAttachments(list => list.filter(att => att.kind !== 'pending' || att.draftId !== draftId));
    }, []);

    const handleDraftAttachmentUploaded = useCallback((draftId: string, uploadedAttachment: Attachment) => {
        setAttachments(list => list.map(att => {
            if (att.kind !== 'pending' || att.draftId !== draftId) {
                return att;
            }

            return {
                kind: 'uploaded',
                attachment: uploadedAttachment,
            };
        }));
    }, []);

    const renderPendingFilePreview = () => {
        if (!pendingFile || !previewUrl) {
            return null;
        }

        const mimeType = pendingFile.type;
        if (mimeType.startsWith('image/')) {
            return <img className={styles.filePreviewImage} src={previewUrl} alt={pendingFile.name} />;
        }

        if (mimeType.startsWith('video/')) {
            return <video className={styles.filePreviewMedia} src={previewUrl} controls />;
        }

        if (mimeType.startsWith('audio/')) {
            return <audio className={styles.filePreviewAudio} src={previewUrl} controls />;
        }

        if (mimeType === 'application/pdf') {
            return <iframe className={styles.filePreviewFrame} src={previewUrl} title={pendingFile.name} />;
        }

        return (
            <div className={styles.filePreviewFallback}>
                <span className={styles.filePreviewFallbackIcon}>FILE</span>
                <span>{mimeType || 'Unknown file type'}</span>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <Dialog.Root open={pendingFile != null} onOpenChange={(open) => !open && closeFilePreview()}>
                <Dialog.Portal>
                    <Dialog.Overlay className={dialogStyles.overlay}/>
                    <Dialog.Content className={dialogStyles.container}>
                        <Dialog.Title className={dialogStyles.title}>Send file</Dialog.Title>
                        {pendingFile && (
                            <div className={styles.filePreviewDialog}>
                                <div className={styles.filePreviewArea}>
                                    {renderPendingFilePreview()}
                                </div>
                                <div className={styles.filePreviewMeta}>
                                    <span className={styles.filePreviewName}>{pendingFile.name}</span>
                                    <span className={styles.filePreviewDetails}>
                                        {pendingFile.type || 'Unknown MIME type'} - {formatFileSize(pendingFile.size)}
                                    </span>
                                </div>
                                {canUploadAsFile(pendingFile) && (
                                    <label className={styles.filePreviewOption}>
                                        <input
                                            type="checkbox"
                                            checked={uploadPendingFileAsFile}
                                            onChange={(e) => {
                                                setUploadPendingFileAsFile(e.target.checked);
                                                if (e.target.checked) {
                                                    setCompressPendingFile(false);
                                                }
                                            }}
                                        />
                                        <span>Send as file</span>
                                    </label>
                                )}
                                {canCompressFile(pendingFile) && (
                                    <label className={styles.filePreviewOption}>
                                        <input
                                            type="checkbox"
                                            checked={compressPendingFile}
                                            disabled={uploadPendingFileAsFile}
                                            onChange={(e) => setCompressPendingFile(e.target.checked)}
                                        />
                                        <span>Compress</span>
                                    </label>
                                )}
                            </div>
                        )}
                        <div className={dialogStyles.bottomButtons}>
                            <Button type="button" onClick={closeFilePreview}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={confirmPendingFile}>
                                Send
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
            {isEditing && (
                <div className={styles.editBanner}>
                    <span>Editing message</span>
                    <X className={styles.replyPreviewClear} onClick={onCancelEdit} />
                </div>
            )}
            {!isEditing && replyToMessage && (
                <div className={styles.replyPreview}>
                    <img
                        className={styles.replyPreviewAvatar}
                        src={replyToMessage.user.avatarUrl ?? `https://i.pravatar.cc/?img=${replyToMessage.userId}`}
                        alt={replyToMessage.user.name}
                    />
                    <div className={styles.replyPreviewQuote}>
                        <div className={styles.replyPreviewHeader}>
                            <span className={styles.replyPreviewAuthor}>{replyToMessage.user.name}</span>
                            <span className={styles.replyPreviewTime}>
                                • {formatTimestamp(new Date(replyToMessage.updatedAt))}
                            </span>
                        </div>
                        <div className={styles.replyPreviewText}>{replyToMessage.content}</div>
                    </div>
                    <X className={styles.replyPreviewClear} onClick={onClearReply} />
                </div>
            )}
            {attachments.length > 0 && (
                <div className={styles.attachmentsList}>
                    {attachments.map(attachment => (
                        attachment.kind === 'uploaded'
                            ? (
                                <MessageEditorAttachment
                                    key={attachment.attachment.id}
                                    attachment={attachment.attachment}
                                    onDelete={handleDeleteAttachment}
                                />
                            )
                            : (
                                <MessageEditorAttachment
                                    key={attachment.draftId}
                                    draftId={attachment.draftId}
                                    file={attachment.file}
                                    compress={attachment.compress}
                                    asFile={attachment.asFile}
                                    onUploaded={handleDraftAttachmentUploaded}
                                    onDelete={handleDeleteDraftAttachment}
                                />
                            )
                    ))}
                </div>
            )}
            {isVoiceModalOpen && (
                <VoiceRecorderModal
                    onClose={() => setIsVoiceModalOpen(false)}
                    onRecorded={handleMediaRecorded}
                />
            )}
            {isVideoModalOpen && (
                <VideoRecorderModal
                    onClose={() => setIsVideoModalOpen(false)}
                    onRecorded={handleMediaRecorded}
                />
            )}
            <form onSubmit={handleSend} className={styles.sendForm}>
                <Mic className={styles.voiceRecordIcon} onClick={() => setIsVoiceModalOpen(true)} />
                <Video className={styles.videoRecordIcon} onClick={() => setIsVideoModalOpen(true)} />
                <div className={styles.fileDropArea}>
                    <Paperclip className={styles.fileAttachmentIcon} onClick={onFileSelectClick} />
                </div>
                <div className={styles.inputWrapper}>
                    <EmojiSuggestionsPopup
                        ref={suggestionsRef}
                        query={emojiQuery?.query ?? null}
                        onSelect={applyEmojiSuggestion}
                    />
                    <textarea
                        ref={inputRef}
                        rows={1}
                        placeholder={isEditing ? 'Edit message…' : 'Type a message...'}
                        className="block w-full resize-none max-h-40 overflow-y-auto bg-transparent text-white placeholder-[#5f6a8c] p-2 focus:outline-none"
                        value={text}
                        onChange={handleTextChange}
                        onKeyDown={handleInputKeyDown}
                        onSelect={(e) => setCaret(e.currentTarget.selectionStart)}
                        onBlur={() => setCaret(null)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={!canSubmit}
                    className={styles.sendButton}
                    title={isEditing ? 'Save' : 'Send'}
                >
                    {isEditing ? <Check /> : <SendHorizontal />}
                </button>
            </form>
        </div>
    );
}
