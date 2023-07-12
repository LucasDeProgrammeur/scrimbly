import { useContext, useEffect, useRef, useState } from "react";
import { CurrentNoteName } from "../App";
import Sortable from 'sortablejs';
import { ReactSortable } from "react-sortablejs";

interface TabBarProps {
    tabs: string[];
    setTabs: React.Dispatch<React.SetStateAction<Array<string>>>;
}



const TabBar = ({ tabs, setTabs }: TabBarProps) => {
    const [currentNoteName, setCurrentNoteName] = useContext(CurrentNoteName);

    const [localTabs, setLocalTabs] = useState(tabs.map((e, i) => ({ id: i, name: e, description: "" })))


    useEffect(() => {
        setLocalTabs(tabs.map((e, i) => ({ id: i, name: e, description: "" })))
    }, [tabs])

    useEffect(() => console.log("tabs changed to:", tabs), [tabs])

    return (
        <ReactSortable
            list={localTabs} setList={setLocalTabs}
            className="tabBar"
            onChange={e => e.target.classList.add("disableHover")}
            onEnd={e => e.target.classList.remove("disableHover")}
            animation={200}>
            {localTabs.map((e, i) => {
                console.log(e)
                return (
                    <div key={i} onClick={() => setCurrentNoteName(e.name)} className={e.name === currentNoteName ? "tabItem selectedTab" : "tabItem"}  >
                        <div>{e.name}</div>
                        {e.name === currentNoteName ?
                            <div onClick={(ev) => {
                                ev.stopPropagation();
                                setCurrentNoteName(tabs[i + 1]);
                                setTabs(tabs.filter(tabName => tabName !== e.name))
                            }}>&#xE8BB;
                            </div> : ""}
                    </div>)

            })}
        </ReactSortable>);
}

export default TabBar;