import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  PointElement,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const GITHUB_API_BASE_URL = 'https://api.github.com/repos';
const GITHUB_ACCESS_TOKEN = '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'; // Replace with your GitHub access token

const DisplayMetrics = () => {
  const [commitData, setCommitData] = useState({});
  const [params] = useSearchParams();
  const [pullRequestData, setPullRequestData] = useState([]);
  const [issueResolutionTime, setIssueResolutionTime] = useState(0);
  const [contributorActivity, setContributorActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state indicator

  const owner = params.get('owner') // Replace with actual owner/username
  const repo = params.get('reponame'); // Replace with actual repository name
  const responseCounter = 0;
  useEffect(() => {
    // Fetch commit frequency
    axios.get(`${GITHUB_API_BASE_URL}/${owner}/${repo}/stats/commit_activity`, {
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`
      }
    })
      .then(response => {
        const data = response.data;
        if(data){
          const chartData = {
            labels: data.map((week, index) => `Week ${index + 1}`),
            datasets: [
              {
                label: 'Commits',
                data: data.map(week => week.total),
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
              }
            ]
          };
          setCommitData(chartData); // Ensure commitData is defined and set to an empty array if undefined
          responseCounter++;
          setIsLoading(false); // Update loading state after data is fetched
        }
        
      })
      .catch(error => {
        console.error('Error fetching commit frequency:', error);
        setIsLoading(false); // Update loading state in case of error
      });

    // Fetch pull request trends
    axios.get(`${GITHUB_API_BASE_URL}/${owner}/${repo}/pulls?state=all`, {
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`
      }
    })
      .then(response => {
        // Group by created, merged, and closed dates
        const pullRequests = response.data;
        const createdCounts = {};
        const mergedCounts = {};
        const closedCounts = {};

        pullRequests.forEach(pr => {
          const createdDate = new Date(pr.created_at).toDateString();
          const mergedDate = pr.merged_at ? new Date(pr.merged_at).toDateString() : null;
          const closedDate = pr.closed_at ? new Date(pr.closed_at).toDateString() : null;

          createdCounts[createdDate] = (createdCounts[createdDate] || 0) + 1;
          if (mergedDate) {
            mergedCounts[mergedDate] = (mergedCounts[mergedDate] || 0) + 1;
          }
          if (closedDate) {
            closedCounts[closedDate] = (closedCounts[closedDate] || 0) + 1;
          }
        });

        // Convert to arrays
        const labels = Object.keys(createdCounts).sort();
        const createdData = labels.map(date => createdCounts[date] || 0);
        const mergedData = labels.map(date => mergedCounts[date] || 0);
        const closedData = labels.map(date => closedCounts[date] || 0);

        // Set the chart data
        setPullRequestData({
          labels,
          datasets: [
            {
              label: 'Created Pull Requests',
              data: createdData,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
              label: 'Merged Pull Requests',
              data: mergedData,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
              label: 'Closed Pull Requests',
              data: closedData,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
          ]
        });
      })
      .catch(error => {
        console.error('Error fetching pull requests:', error);
      });

    // Fetch issue resolution time
    axios.get(`${GITHUB_API_BASE_URL}/${owner}/${repo}/issues?state=closed`, {
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`
      }
    })
      .then(response => {
        const closedIssues = response.data || []; // Ensure closedIssues is defined and set to an empty array if undefined

        const resolutionTimes = closedIssues.map(issue => {
          const createdAt = new Date(issue.created_at);
          const closedAt = new Date(issue.closed_at);
          return (closedAt - createdAt) / (1000 * 60 * 60 * 24); // convert to days
        });

        const averageResolutionTime = resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length;

        setIssueResolutionTime({
          labels: [`Average Resolution Time for ${closedIssues.length} Issues`],
          datasets: [
            {
              label: 'Days',
              data: [averageResolutionTime],
              borderColor: 'rgb(255, 205, 86)',
              backgroundColor: 'rgba(255, 205, 86, 0.5)',
            }
          ]
      });
      })
      .catch(error => {
        console.error('Error fetching closed issues:', error);
      });

    // Fetch contributor activity
    axios.get(`${GITHUB_API_BASE_URL}/${owner}/${repo}/stats/contributors`, {
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`
      }
    })
      .then(response => {
        const contributors = response.data;

        // Process the contributor data
        const data = contributors.map(contributor => {
          const totalCommits = contributor.total;
          const totalAdditions = contributor.weeks.reduce((acc, week) => acc + week.a, 0);
          const totalDeletions = contributor.weeks.reduce((acc, week) => acc + week.d, 0);
    
          return {
            username: contributor.author.login,
            totalCommits,
            totalAdditions,
            totalDeletions,
          };
        });
    
        // Prepare the data for Chart.js
        setContributorActivity({
          labels: data.map(item => item.username),
          datasets: [
            {
              label: 'Commits',
              data: data.map(item => item.totalCommits),
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
              label: 'Additions',
              data: data.map(item => item.totalAdditions),
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
              label: 'Deletions',
              data: data.map(item => item.totalDeletions),
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        });      
      })
      .catch(error => {
        console.error('Error fetching contributor activity:', error);
      });

  }, [owner, repo]);
  if (isLoading || commitData.length == 0 || pullRequestData.length == 0|| issueResolutionTime.length == 0 || contributorActivity.length == 0) {
    return <div>Loading...</div>; // Show loading indicator while data is being fetched
  } else {
    return (
      <div className="App">
        <h1>GitHub Repository Metrics</h1>
        {/* Render Commit Frequency Chart */}
        <Bar data={commitData} />
        <Line data={pullRequestData} />
        <Bar data={issueResolutionTime} />
        <Bar data={contributorActivity} />
      </div>
    );
  }

  
};
export default DisplayMetrics;
