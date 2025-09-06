import { ReactNode } from "react"

export function IconButton({
  icon,
  onClick,
  activated,
}: {
  icon: ReactNode
  onClick: () => void
  activated: boolean
}) {
  return (
    <div
      className={`m-2 pointer rounded-full border p-2 bg-black cursor-pointer hover:bg-gray ${activated ? "text-yellow-300 border-2 border-yellow-500" : "text-slate-50 border-slate-100"}`}
      onClick={onClick}
    >
      {icon}
    </div>
  )
}
