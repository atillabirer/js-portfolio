import { google } from 'googleapis';

const loadAnalyticsData = async () => {
  const auth = await google.auth.getClient({
    scopes:  ['https://www.googleapis.com/auth/analytics.readonly'],
  })

  const analytics = google.analytics({
    version: 'v3',
    auth,
  });
  
  return analytics.data.ga.get({
    ids: "ga:215685179",
    // GOOGLE_API_KEY contains the PATH to the .json file containing our keys
    auth: process.env.GOOGLE_API_KEY,
    "start-date": "30daysAgo",
    "end-date": "yesterday",
    metrics: "ga:goal1Completions",
    dimensions: "ga:date",
    samplingLevel: "HIGHER_PRECISION",
  });
}

export default loadAnalyticsData;
