import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';




class Matrix  {
  contructor(arrays) {
    this.state = arrays;
  }
  
  getIndex(i, j) {
    return this.state[i][j]
  }
}


const ScoreContainer = styled.div`
display: flex;
justify-content: space-between;`
const Container = styled.div`
display: grid;
grid-template-columns: repeat(4, 100px);
grid-template-rows: repeat(4, 100px);
grid-gap: 10px;
position: absolute;
`

const Instance = styled.div`
background: #f5f5f5;
border-radius: 1rem;
display: flex;
align-items: center;
justify-content:center;
font-weight:600;
font-size: 2rem;`


const ActiveInstanceStyle= styled(Instance)`
position: absolute;
height: 100px;
width:100px;
background-color:#0078d4;
top:0;
left:0;
top: ${props=>props.row*100 + props.row*10}px;
left: ${props=>props.column*100 + props.column*10}px;
transition: all 0.5s ease;

`
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const addEquals =(array) => {
  let newArray = array.reduce((previousValue, currentValue, currentIndex) => {
    if (currentValue == array[currentIndex-1]){
      previousValue[previousValue.length-1] = currentValue*2
    }else{
      previousValue.push(currentValue)
    }
    return previousValue;
  }, []);
  return newArray

}

const reverseMatrix = (matrix) => {
  const modifiedMatrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]
  for(let r=0; r<=matrix.length-1; ++r){
    for(let c=0; c<=matrix.length-1; ++c){
      modifiedMatrix[r][c] = matrix[c][r]
    }
  }

  return modifiedMatrix
}

const onD = (matrix) => {
  let newMatrix = matrix.map(array=>{
    const newArray = array.filter(el=>el!==0)
    const noEqualsArray = addEquals(newArray)
    let a = new Array(4-noEqualsArray.length); for (let i=0; i<4-noEqualsArray.length; ++i) a[i] = 0;
    return [...a, ...noEqualsArray]
  })
  return newMatrix
}



const onA = (matrix) => {
  let newMatrix = matrix.map(array=>{
    const newArray = array.filter(el=>el!==0)
    const noEqualsArray = addEquals(newArray)
    let a = new Array(4-noEqualsArray.length); for (let i=0; i<4-noEqualsArray.length; ++i) a[i] = 0;
    return [ ...noEqualsArray, ...a]
  })
  return newMatrix
}



const onW = (matrix)=>{
  const reversedMatrix = reverseMatrix(matrix)
  const modifiedReversedMatrix = onA(reversedMatrix)
  const finalMatrix = reverseMatrix(modifiedReversedMatrix)
  return finalMatrix
}

const onS = (matrix)=>{
  const reversedMatrix = reverseMatrix(matrix)
  const modifiedReversedMatrix = onD(reversedMatrix)
  const finalMatrix = reverseMatrix(modifiedReversedMatrix)
  return finalMatrix
}

const aRandomNumber = (matrix) => {
  const modifiedMatrix = [...matrix]
  let r = getRandomInt(3)
  const index = modifiedMatrix[r].findIndex(el=>el===0)
  
  modifiedMatrix[r][index] = 2
  return modifiedMatrix

  
}




function App() {
  const keyPressed = useKeyPress()
  const [matrix, setMatrix] = useState(
    [
    [0, 0, 0, 0],
    [0, 2, 4, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]
    
  )

  function downHandler({ key }) {
    console.log("grid")
    switch(key){
      case("d"):{

        setMatrix(previous=>onD(previous))
        setMatrix(previous=>aRandomNumber(previous))
        break;
      }
      case("a"):{
        setMatrix(previous=>onA(previous))
        setMatrix(previous=>aRandomNumber(previous))
        break;
      }
      case("w"):{
        setMatrix(previous=>onW(previous))
        setMatrix(previous=>aRandomNumber(previous))
        break;
      }
      case("s"):{
        setMatrix(previous=>onS(previous))
        setMatrix(previous=>aRandomNumber(previous))
        break;
      }

      
    }
  }

  useDidMountEffect(() => {
    window.addEventListener("keydown", downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [])



  
  useDidMountEffect(()=>{
    
    
  },[keyPressed])


  
  return (
    <div className="App">
      <ScoreContainer>
        <h5>Score: {matrix.flat().reduce((p, c)=>{return p+c})}</h5>
      </ScoreContainer>
     <Container>
      {matrix.map((array, arrayIndex)=>{
        return array.map((el, elIndex)=><Instance  key={elIndex}></Instance>)
      })}
      {matrix.map((array, arrayIndex)=>{
        return array.map((el, elIndex)=><ActiveInstance row={arrayIndex} column={elIndex}  key={elIndex}>{el}</ActiveInstance>)
      })}
   
     </Container>
    </div>
  );
}

export default App;





const ActiveInstance = ({children, row, column}) => {
  return(
    
    <ActiveInstanceStyle style={{opacity: children?1:0}} row={row} column={column} >{children}</ActiveInstanceStyle>
  )
}




// Hook
function useKeyPress() {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState("");
  // If pressed key is our target key then set to true
  function downHandler({ key }) {
    setKeyPressed(key);
  }
  // If released key is our target key then set to false
  console.log(keyPressed)
  // Add event listeners
  useDidMountEffect(() => {
    window.addEventListener("keydown", downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
}



const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
  }, deps);
}

