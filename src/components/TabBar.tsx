import { useContext, useEffect, useRef, useState } from "react";
import { CurrentNoteName, CurrentTabs } from "../App";
import { ReactSortable } from "react-sortablejs";




const TabBar = () => {
    const [currentNoteName, setCurrentNoteName] = useContext(CurrentNoteName);
    const [currentTabs, setCurrentTabs] = useContext(CurrentTabs);

    const [localTabs, setLocalTabs] = useState(currentTabs.map((e, i) => ({ id: i, name: e, description: "" })))


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
                    <div key={i} onClick={() => setCurrentNoteName(e.name)} className={e.name === currentNoteName ? "tabItem selectedTab" : "tabItem"}  >
                        <div>{e.name}</div>
                        {e.name === currentNoteName ?
                            <div onClick={(ev) => {
                                ev.stopPropagation();
                                setCurrentNoteName(currentTabs[i + 1]);
                                setCurrentTabs(currentTabs.filter(tabName => tabName !== e.name))
                            }}>&#xE8BB;
                            </div> : ""}
                    </div>)

            })}
        </ReactSortable>);
}

export default TabBar;