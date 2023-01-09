import axios from "axios";
import { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { PaginationChangePage } from "react-data-table-component/dist/src/DataTable/types";
import Web3 from "web3";
const TransactionHistory = () => {
  const [loading, setloading] = useState(true);
  const [Columns, setColumns] = useState<any>([]);
  const [data,setData]=useState([])
  const [count,setCount]=useState(0)
  
  const [perpage,setperPage]=useState(10)
  const {ethereum}:any=window
  const web3=new Web3(ethereum)
  // console.log(history);
  useEffect(() => {
    //   setloading(true)'
    // fetchUser()
    const timeOut = setTimeout(() => {
      setColumns([
        {
          name: "From",
          selector: (row: any) => row.from,
          sortable: true,
        },
        {
          name: "To",
          selector: (row: any) => row.to,
          sortable: true,
        },
        {
          name: "Amount",
          selector: (row: any) => row.amount,
          sortable: true,
        },
        {
          name: "Hash",
          selector: (row: any) => row.hash,
          sortable: true,
        },
        {
          name: "Network",
          selector: (row: any) => row.network,
          sortable: true,
        },
        {
          name: "ChainId",
          selector: (row: any) => row.chainId,
          sortable: true,
        },
      ]);
      setloading(false);
    }, 2000);
    return () => {
      clearTimeout(timeOut);
    };
  }, []);
  createTheme('solarized', {
    text: {
      primary: '#268bd2',
      secondary: '#2aa198',
    },
    background: {
      default: '#002b36',
    },
   
    action: {
     
      hover: 'rgba(0,0,0,.08)',
      
    },
  }, 'dark');
  const customStyle = {
    row: {
      style: {
        minHeight: "72px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        backgroundColor: "#a4a4e6",
        fontSize:'1.6em',
        
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        fontSize:'1.1em',
      },
    },
  };
  const getchainId=async ()=>{
      const chainId=await web3.eth.getChainId()
      console.log(chainId);
      return chainId
  }
  
  const fetchUser=async(page:any)=>{
    setloading(true)
    console.log(perpage);
    
   const chainId=await getchainId()
    axios.get(`http://localhost:3002/gethistory/?chain=${chainId}&page=${page}&perpage=${perpage}`)
    .then(responce=>{
      console.log(responce.data);
      setData(responce.data.Transaction)
      setCount(responce.data.count)
      
    })
    .catch(error=>{
      console.log(error);
      
    })
  }
  const handleChangePage=(perPage:any,page:any)=>{
    console.log(page);
      
    fetchUser(page)
      
  }
  const handleChangeRowPerPage=(perPage:any,page:any)=>{
    console.log(perPage,page);
    setperPage(perPage)

  }


  return (
    <div>
      <DataTable
        progressPending={loading}
        columns={Columns}
        data={data}
        pagination
        selectableRows
        customStyles={customStyle}
        highlightOnHover
        pointerOnHover
        theme="solarized"
 
        paginationTotalRows={count}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowPerPage}
        
      />
    </div>
  );
};

export default TransactionHistory;
