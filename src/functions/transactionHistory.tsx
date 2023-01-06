import { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
const TransactionHistory = ({ history }: any) => {
  const [loading, setloading] = useState(true);
  const [Columns, setColumns] = useState<any>([]);

  console.log(history);
  useEffect(() => {
    //   setloading(true)
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

  return (
    <div>
      <DataTable
        progressPending={loading}
        columns={Columns}
        data={history}
        pagination
        selectableRows
        customStyles={customStyle}
        highlightOnHover
        pointerOnHover
        theme="solarized"
      />
    </div>
  );
};

export default TransactionHistory;
