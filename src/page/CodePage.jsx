import { Box } from "@primer/react";
import SplitContainer from "../components/SplitContainer";
import "./CodePage.css";
import { Button, IconButton } from "@primer/react";
import { SidebarCollapseIcon, SidebarExpandIcon } from "@primer/octicons-react";
import { useState } from "react";
import axios from 'axios';

export default function CodePage({ param, setShowEditor, searchQuery }) {
  console.log("----------",searchQuery)
  // state for managing files collapse or expand
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // const handleDeploy = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:9000/project', { searchQuery });
  //     // Access response data
  //     console.log('Response:', response.data);
  //     // Optionally handle success or show a success message
  //     console.log('Deployment initiated successfully.');
  //   } catch (error) {
  //     // Handle error, e.g., display error message to user
  //     console.error('Error initiating deployment:', error);
  //   }
  // };


  // Code to make an API call to deploy the project
  
  const handleDeploy = async () => {
    try {
      const response = await axios.post('http://localhost:9000/project', { searchQuery }, { timeout: 10000 }); // Set timeout to 10 seconds
      // Access response data
      console.log('Response:', response.data);
      // Optionally handle success or show a success message
      console.log('Deployment initiated successfully.');
    } catch (error) {
      // Handle error, e.g., display error message to user
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          console.error('Server responded with error status:', error.response.status);
          console.error('Error response data:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received from the server.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up the request:', error.message);
        }
      } else {
        // Handle non-axios errors
        console.error('Non-Axios error occurred:', error);
      }
    }
  };

  return (
    <Box bg="canvas.default" width="100%" minHeight="100vh">
      <div className="headerFlex">
        <div className="repoInfoDiv">
          <div>
            {isSidebarCollapsed ? (
              <IconButton
                onClick={() => setIsSidebarCollapsed(false)}
                aria-label="expand"
                icon={SidebarExpandIcon}
                sx={{ ml: 2 }}
              />
            ) : (
              <IconButton
                onClick={() => setIsSidebarCollapsed(true)}
                aria-label="collapse"
                icon={SidebarCollapseIcon}
                sx={{ ml: 2 }}
              />
            )}
          </div>
          <div className="repoNameDiv">{`${param.owner} / ${param.name}`}</div>
          {/* <div>{`Branch`}</div> */}
        </div>
        <div className="closeBtnDiv">
          <Button variant="danger" onClick={() => setShowEditor(false)}>
            Close
          </Button>
        </div>
        <div className="deployBtnDiv">
          <Button variant="primary" onClick={handleDeploy}>
            Deploy!
          </Button>
        </div>
      </div>
      <SplitContainer param={param} isSidebarCollapsed={isSidebarCollapsed} />
    </Box>
  );
}
