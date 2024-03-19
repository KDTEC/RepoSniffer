import {
  Box,
  PageLayout,
  Header,
  Heading,
  Avatar,
  FormControl,
  TextInput,
  Text,
  Button,
  IconButton,
  Link,
  ActionMenu,
  ActionList,

} from "@primer/react";
import GithubGraphQL from '../assets/github-graphql.jpg';
import GithubPrimer from '../assets/github-primer.jpg';
import Monaco from '../assets/monaco-logo.png';
import ReactQuery from '../assets/react-query-logo.png';
import {MarkGithubIcon} from '@primer/octicons-react'


import { useEffect, useState } from "react";
import { fetchRepoData, checkRepoData } from "../utils/requestHandler";

const repoSnifferGifLink = "https://media.giphy.com/media/hVa6t0WpoDOk7Pxb7l/giphy.gif";

// field to enter 
function SearchRepo({ param, setParam, setShowEditor, setSearchQuery }) {
  const [isSearchHappened, setIsSearchHappened] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("submit");

    // make query parameters
    const formData = new FormData(event.currentTarget);
    const fieldValues = Object.fromEntries(formData.entries());
    const searchQuery = fieldValues["github_link"];
    //console.log("-----------------",searchQuery)
    setSearchQuery(searchQuery);
    const owner = searchQuery.split("/")[3];
    const name = searchQuery.split("/")[4];
    const queryVar = {
      owner,
      name,
      branch: "HEAD:",
    };

    // check for repo if it exists or not
    const response = await checkRepoData(queryVar);
    console.log("res : ", response);
    if (
      response.repository.object.entries &&
      response.repository.object.entries.length > 0
    ) {
      // set flags
      setParam(queryVar);
      setIsSearchHappened(true);
      setShowEditor(true);
      // // Update visited repos
      // const newVisitedRepos = [...visitedRepos, searchQuery];
      // console.log("New Visited Repos:", newVisitedRepos);
      // setVisitedRepos(newVisitedRepos.slice(-5)); // Keep only the latest 5 repos

      // // Save visited repos to localStorage
      // localStorage.setItem("visitedRepos", JSON.stringify(newVisitedRepos));
    }
  }

  return (
    <Box width="100%" sx={{p: 8, display: "flex", flexDirection: 'column', alignItems: 'center'}}>
      {isSearchHappened ? (
        <Box>
          <div>Searched, Loading...</div>
        </Box>
      ) : (
        <Box width="50%">
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormControl.Label sx={{fontSize: "18px"}}>Enter Github Repo URL</FormControl.Label>
            <TextInput
              monospace
              size="large"
              block
              aria-label="github link"
              name="github_link"
              placeholder="e.g. https://github.com/facebook/react"
              autoComplete="github link"
              sx={{margin: "10px 0", padding: "0"}}
            />
            <Box width="100%" sx={{display: "flex", justifyContent: 'center', alignItems: 'center'}}>
            <Button type="submit" variant="primary">
              Submit
            </Button>
            </Box>
      
          </FormControl>
        </form>
        </Box>
      )}
    </Box>
  );
}

export default function LandingPage({ param, setParam, setShowEditor, setSearchQuery }) {
  // const [visitedRepos, setVisitedRepos] = useState(() => {
  //   const storedRepos = localStorage.getItem("visitedRepos");
  //   return storedRepos ? JSON.parse(storedRepos) : [];
  // });

  // const handleRepoClick = (repo) => {
  //   // You can implement the logic to handle a click on a specific repo
  //   console.log("Clicked on repo:", repo);
  // };

  return (
    <>
      <Box bg="canvas.default" width="100%" minHeight="100vh">
        <PageLayout width="100%">
          <PageLayout.Header>
            <Box sx={{p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Heading sx={{fontSize: "30px", textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={repoSnifferGifLink} alt="RepoSniffer GIF" style={{ width: '40px', marginRight: '10px' }} />
                <Text as="p" sx={{fontWeight: 'bold', fontSize: "25px"}}>
                RepoSniffer
              </Text>
              </Heading>
              
              
            </Box>
          </PageLayout.Header>
          <PageLayout.Content>
            <Box bg="canvas.default" width="100%" >
              <Box
                direction="vertical"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Heading sx={{fontSize: "30px", textAlign: 'center'}}>
                Effortlessly navigate through various GitHub repos
                <br/>
                 within the realm of open source exploration.
                </Heading>
                <SearchRepo
                  param={param}
                  setParam={setParam}
                  setShowEditor={setShowEditor}
                  setSearchQuery={setSearchQuery}
                  // visitedRepos={visitedRepos}
                  // setVisitedRepos={setVisitedRepos}
                />

{/* <Button
              variant="primary"
              onClick={() => setShowEditor(true)} // Add logic to handle displaying your editor
              sx={{ marginTop: "20px" }}
            >
              Explore
            </Button>
            {visitedRepos.length > 0 && (
              <ActionMenu>
                <ActionMenu.Button>Your Previous Visited Repos</ActionMenu.Button>

                <ActionMenu.Overlay>
                  <ActionList>
                    {visitedRepos.map((repo, index) => (
                      <ActionList.Item
                        key={index}
                        onSelect={() => handleRepoClick(repo)}
                      >
                        {repo}
                      </ActionList.Item>
                    ))}
                  </ActionList>
                </ActionMenu.Overlay>
              </ActionMenu>
            )} */}
                {/* <Button>Your Previous visited Repos</Button> */}
                {/* <ActionMenu>
                  <ActionMenu.Button>Your previous visited repos</ActionMenu.Button>

                  <ActionMenu.Overlay>
                    <ActionList>
                      <ActionList.Item onSelect={event => console.log('New file')}>New file</ActionList.Item>
                      <ActionList.Item>Copy link</ActionList.Item>
                      <A ̰ctionList.Item>Edit file</ActionList.Item>
                      <ActionList.Divider />
                      <ActionList.Item variant="danger">Delete file</ActionList.Item>
                    </ActionList>
                  </ActionMenu.Overlay>
                </ActionMenu> */}
              </Box>
            </Box>
          </PageLayout.Content>
          <PageLayout.Footer sx={{paddingTop: "0px"}}>
            <Box width="100%" sx={{fontSize: "12px",display: "flex",flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>Made With</Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                "& > *": {
                  margin: "30px", /* Add margin between the Avatar components */
                },
              }}
            >
              <Box width="100%" sx={{display: "flex",flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
               <Avatar square size="50" src={GithubGraphQL} />
               <Text as="p" sx={{fontSize: "12px",fontWeight: 'bold', textAlign: 'center'}}>
                  Github 
                  <br />
                  GraphQL API
                </Text>
              </Box>
              <Box width="100%" sx={{display: "flex",flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
               <Avatar square size="50" src={GithubPrimer} />
               <Text as="p" sx={{fontSize: "12px",fontWeight: 'bold', textAlign: 'center'}}>
                  Github 
                  <br />
                  Primer React
                </Text>
              </Box>
              <Box width="100%" sx={{display: "flex",flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
               <Avatar square size="50" src={Monaco} />
               <Text as="p" sx={{fontSize: "12px",fontWeight: 'bold', textAlign: 'center'}}>
                  Monaco
                </Text>
              </Box>
              <Box width="100%" sx={{display: "flex",flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
               <Avatar square size="50" src={ReactQuery} />
               <Text as="p" sx={{fontSize: "12px",fontWeight: 'bold', textAlign: 'center'}}>
                  React Query
                </Text>
              </Box>
            </Box>
          </PageLayout.Footer>
        </PageLayout>
      </Box>
    </>
  );
}
