import { Popover } from 'radix-ui';
import { MixerHorizontalIcon, Cross2Icon } from '@radix-ui/react-icons';

type Props = {
    reactions: string[];
    onSelect(code: string): void;
}
export const ReactionSelectionDialog = ({ reactions, onSelect }: Props) => (
    <Popover.Root>
        <Popover.Trigger asChild>
            <button
                className="inline-flex size-[35px] cursor-default items-center justify-center rounded-full bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                aria-label="Update dimensions"
            >
                <MixerHorizontalIcon/>
            </button>
        </Popover.Trigger>
        <Popover.Portal>
            <Popover.Content
                className="w-[260px] rounded bg-white p-5 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade"
                sideOffset={5}
            >
                <div className="flex flex-col gap-2.5">
                    <p className="mb-2.5 text-[15px] font-medium leading-[19px] text-mauve12">
                        Dimensions
                    </p>
                    {reactions.map(reaction => (
                        <div aria-label="Close" key={reaction} onClick={() => onSelect(reaction)}>{reaction}</div>
                    ))}
                </div>
                <Popover.Close
                    className="absolute right-[5px] top-[5px] inline-flex size-[25px] cursor-default items-center justify-center rounded-full text-violet11 outline-none hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7"
                    aria-label="Close"
                >
                    <Cross2Icon/>
                </Popover.Close>
                <Popover.Arrow className="fill-white"/>
            </Popover.Content>
        </Popover.Portal>
    </Popover.Root>
);
