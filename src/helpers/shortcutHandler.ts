import { Dispatch } from "react"

export const handleShortcut = (event: React.KeyboardEvent<HTMLDivElement>, optionBarOpen: boolean, setOptionBarOpen: Dispatch<React.SetStateAction<boolean>>) => {
    console.log(event.key)

    if (event.ctrlKey && event.shiftKey && event.key === "P") {
        setOptionBarOpen(!optionBarOpen)
    }
}