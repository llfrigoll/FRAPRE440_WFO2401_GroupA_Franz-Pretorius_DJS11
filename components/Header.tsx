export default function Header() {
    return (
        <div
            data-ref="header"
            className="flex w-screen bg-slate-800 h-20 fixed z-40">
            <img
                src="./public/Podd_Logo.png"
                className="h-3/4 mt-auto mb-auto ml-24 "
            />
            <h1 className="text-slate-400 font-semibold text-3xl mt-auto mb-auto ml-2">
                Podd
            </h1>
        </div>
    )
}
