import { useContext, useEffect, useState } from "react";
import { CurrentNoteName, CurrentTabs } from "../App";
import { ReactSortable } from "react-sortablejs";




const TabBar = () => {
    const [currentNoteName, setCurrentNoteName] = useContext(CurrentNoteName);
    const [currentTabs, setCurrentTabs] = useContext(CurrentTabs);

    const [localTabs, setLocalTabs] = useState(currentTabs.map((e, i) => ({ id: i, name: e, description: "" })))

    const handleDeletion = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>, currentTab: any, index: number) => {
        ev.stopPropagation();
        setCurrentNoteName(currentTabs[index + 1]);
        setCurrentTabs(currentTabs.filter(tabName => tabName !== currentTab.name))
    }

    useEffect(() => {
        setLocalTabs(currentTabs.map((e, i) => ({ id: i, name: e, description: "" })))
    }, [currentTabs])


    return (
        <ReactSortable
            list={localTabs} setList={setLocalTabs}
            className="tabBar"
            onChange={e => e.target.classList.add("disableHover")}
            onEnd={e => e.target.classList.remove("disableHover")}
            animation={200}>
            {localTabs.map((e, i) => {
                return (
                    <div key={i}
                        onMouseDown={(ev) => {
                            if (ev.button === 1) {
                                ev.preventDefault();
                                handleDeletion(ev, e, i)
                            }
                        }}
                        onClick={(ev: any) => {
                            console.log(ev.button)
                            setCurrentNoteName(e.name)
                        }
                        }
                        className={e.name === currentNoteName ? "tabItem selectedTab" : "tabItem"}

                    >
                        <div>{e.name}</div>
                        {e.name === currentNoteName ?
                            <div onClick={ev => handleDeletion(ev, e, i)}>&#xE8BB;
                            </div> : ""}
                    </div>)

            })}
        </ReactSortable>);
}

export default TabBar;