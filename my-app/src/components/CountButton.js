import { useState } from "react";

function CountButton(){
    const [count, setCount] = useState(0)
function solveClick(){
    setCount(count+1);
}
    return (
<button onClick={solveClick}>
Clicked {count} times
</button>
    );
}

export default CountButton;