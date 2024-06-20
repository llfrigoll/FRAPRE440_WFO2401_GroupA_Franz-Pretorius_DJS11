interface LoadIconProps {
    iconColor: string
}

export default function LoadIcon({ iconColor }: LoadIconProps) {
    return (
        <div
            className={
                iconColor +
                ` animate-spin h-8 w-8 mx-auto mt-10 rounded-full border-2 border-solid border-t-transparent z-50`
            }></div>
    )
}
