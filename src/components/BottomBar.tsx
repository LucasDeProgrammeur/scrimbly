import WordCounter from "./WordCounter"

interface BottomBarProps {
    content: string;
}

const BottomBar = ({ content }: BottomBarProps) => {
        return (
            <div className="bottomBar" style={{ pointerEvents: "none" }}>
                <p className="bottomBarInfo">{""}</p>
                <WordCounter content={content} />
            </div >
        )
        
}
export default BottomBar;