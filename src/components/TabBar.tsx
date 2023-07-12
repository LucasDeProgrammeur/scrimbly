import { useContext, useEffect, useState } from "react";
import { CurrentNoteName } from "../App";

interface TabBarProps {
    tabs: string[];
    setTabs: React.Dispatch<React.SetStateAction<Array<string>>>;
}



const TabBar = ({ tabs, setTabs }: TabBarProps) => {

    const [currentNoteName, setCurrentNoteName] = useContext(CurrentNoteName);

    let [tabElements, setTabElements] = useState([] as JSX.Element[]);



    useEffect(() => {
        setTabElements(tabs.map((name, i) => {
            return (
                <div key={i} onClick={() => setCurrentNoteName(name)} className={name === currentNoteName ? "tabItem selectedTab" : "tabItem"}>
                    <div>{name}</div>
                    {name === currentNoteName ?
                        <div style={{ zIndex: 2 }} onClick={(ev) => { 
                            ev.stopPropagation(); 
                            setCurrentNoteName(tabs[i + 1]); 
                            setTabs(tabs.filter(tabName => tabName !== name)) }}>&#xE8BB;
                        </div> : ""}
                </div>)
        }))
    }, [currentNoteName, setTabs, tabs, setCurrentNoteName])

    return (<div className="tabBar" >
        {tabElements}
    </div>);
}

export default TabBar;