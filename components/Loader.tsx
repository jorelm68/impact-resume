export type LoaderProps = {
    show?: boolean;
}

export default function Loader({ show = true }: LoaderProps) {
    return show ? <div className='loader' /> : null;
}