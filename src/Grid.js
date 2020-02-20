import React, {useState, useMemo} from 'react';
import styled from 'styled-components';

/**
 * @description A React Component that renders a Table
 * 
 * @constructor
 * Grid
 * @param {Object[]} config - <b>column configuration item:</b> <br>
 *                             <ul>
 *                                  <li>title (string): the column title</li>
 *                                  <li>fieldName (string): a data accessor</li>
 *                                  <li>component (function): optional custom cell component. function is passed entire item data </li>
 *                                  <li>headerComponent (function): optional custom header component. function is passed the rest of this config </li>
*                                   <li>headerStyle (function/object): optional custom header container (th) css style. function is passed the rest of this column config</li>
*                                   <li>cellStyle (function/object): optional custom cell container (td) css style. function is passed  passed entire item data, for conditional styling </li>
 *                             </ul>
 *                            
 * @param {Object[]} data - your table data, arranged in rows by items
 * 
 */

const Grid = ({ config, data }) => {
  
  const [pageSize] = useState(15); 
  const [pageNum, setPageNum] = useState(1);
  
  // just adding range checks to setters 
  const pageBack = ()=>{
    if (pageNum > 1){
      setPageNum(pageNum - 1);
    }
  };

  const pageForward = ()=>{
    if (pageNum * pageSize < data.length - 1) {
      setPageNum(pageNum + 1);
    }
  };

  // helper method to support both function and object input  
  const getStyleFromConfig = (styleData, passedData) => {
    if(typeof(styleData) == 'function'){
      return styleData(passedData)
    }
    if (typeof(styleData) == 'object'){
      return {...styleData}
    }
  } 

  // the iterators are wrapped with useMemo hooks as optimization - it is not crucial to app functionality but can reduce renders if 'watched' variables don't change 
  const headers =  useMemo(()=>{
      return config.map((columnData, columnIndex)=>{
          //extract cell content and container style if needed
          const headerStyle = typeof(columnData.headerStyle) != 'undefined' ? getStyleFromConfig(columnData.headerStyle,columnData) : {};
          const headerContent = typeof(columnData.headerComponent) == 'function' ? columnData.headerComponent({columnData}) : columnData.title;
          return (<GenericHeader style={headerStyle} key={`th_${columnIndex}`}>{headerContent}</GenericHeader>)            
      });
    },[config]);
  
  const rows = useMemo(()=>{      
      const renderRowCells = (rowData, config) => {
          return config.map((configItem, columnIndex)=>{
              //extract cell content and container style if needed
              const cellStyle = typeof(configItem.cellStyle) != 'undefined' ? getStyleFromConfig(configItem.cellStyle,rowData) : {};
              const cellContent = typeof(configItem.component) == 'function' ? configItem.component({data:rowData}) : rowData[configItem.fieldName];
              return <GenericCell style={cellStyle} key={`td_${columnIndex}`}>{ cellContent}</GenericCell>                  
          })          
      };
      // do pagination. data itself not changed
      const shownData = data.slice(((pageNum - 1)*pageSize), ((( pageNum -1 )*pageSize)+ (pageSize)))
      return shownData.map((row,rowIndex)=>(
          <tr key={`td_${rowIndex}`}>
          {renderRowCells(row, config)}          
          </tr>)
      );
    },
    [data, pageSize, pageNum, config]
  );
  // dynamically create paging options
  const pagingButtons = useMemo( 
    () => {
      let buttons = [];
      for (let i = 0; i < data.length;i += pageSize){
        let buttonNum = (i / pageSize) + 1 ;
        buttons.push(
          <option key={`pager_${buttonNum}`}
            value={buttonNum -1}>
              {buttonNum}
          </option>);    
      }
      return buttons;
    },
    [data, pageSize, pageNum]
  );
  5
  return  (
    <TableContainer>
       <PaginatorContainer>
          <PaginatorButton disabled={pageNum==1}  onClick={()=>{setPageNum(1)}}>FIRST</PaginatorButton>
          <PaginatorButton disabled={pageNum==1} onClick={pageBack}>PREV</PaginatorButton>
            <PaginatorSelect value={pageNum - 1} onChange={(e)=>{setPageNum(parseInt(e.target.value) + 1)}}>
                  {pagingButtons}
            </PaginatorSelect>
          <PaginatorButton disabled={pageNum==pagingButtons.length} onClick={pageForward}>NEXT</PaginatorButton>          
          <PaginatorButton disabled={pageNum == pagingButtons.length } onClick={()=>{setPageNum(pagingButtons.length)}}>LAST</PaginatorButton>          
      </PaginatorContainer>
      <table>
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
  </TableContainer>)
};

export default Grid;
// If those styles were to be re-used we can easily refactor them to a seperate js module and import them, without anything in rendering.
const GenericHeader = styled.th`
  font-size:1.5em;
`;

const GenericCell = styled.td`
  font-size:1.2em;
  text-align:center;
`;

const PaginatorContainer = styled.div`
  display: flex;
  flex-direction:row;
  align-items: center;
  justify-content: center;
  height: 70px;
`;

const TableContainer = styled.div`
  display: flex;
  flex-direction:column;
`;

const PaginatorButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width:100px;
  border: 1px solid black;
  border-radius:7px;
  background-color:${(p)=>p.highlighted ? 'lightgray' : 'white'};
  cursor:pointer;
  margin:0 5px;
  opacity:${(p)=>p.disabled ? 0.4 : 1};
`;

const PaginatorSelect = styled.select`
  font-size:1.4em;
  margin:0 5px;
  border-color:black;
`;