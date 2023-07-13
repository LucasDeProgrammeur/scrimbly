import { useEffect, useState } from "react";

interface WordCounterProps {
    content: string
}

const WordCounter = ({content }:WordCounterProps) => {
  let [charAmount, setCharAmount] = useState(0);
  let [wordAmount, setWordAmount] = useState(0);

  useEffect(() =>{
    let codeFilter = content ? content.replace(/<code.*code>/g, '') : ""
    let nbspFilter = codeFilter.replace("nbsp;", " ");
    let text = nbspFilter ? nbspFilter.replace(/<[^>]+>/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '') : "";
    
    setCharAmount(text.length);
    setWordAmount(text.split(" ").length)
  }, [content])

  return (
    <p className="charNumbers">
      Words: {wordAmount} | Characters: {charAmount}
    </p>
  );
};

export default WordCounter;
