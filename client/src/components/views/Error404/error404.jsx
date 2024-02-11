import React from "react"
import GridLoader from "react-spinners/GridLoader";
import { useState } from "react";
import "./index.css";
function Error404() {

      let [loading, setLoading] = useState(true);
      let [color, setColor] = useState("#0bb8e4");
    
          return <div className="sweet-loading">
    
          <GridLoader
            color={color}
            loading={loading}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
}

export default Error404;