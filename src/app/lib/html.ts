export const htmlContent = (videoDetails: any, newsletter: any, videoId: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter: ${videoDetails.title}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      line-height: 2; 
      color: #333; 
      background-color: #f0f0f0; 
      margin: 0; 
      padding: 0; 
      font-size: 20px;
    }
    
    .container { 
      max-width: 800px; 
      margin: 20px auto; 
      background-color: #ffffff; 
      border-radius: 8px; 
      box-shadow: 0 0 10px rgba(0,0,0,0.1); 
      overflow: hidden;
    }
    .header { 
      background-color: #3498db; 
      padding: 20px; 
      text-align: center; 
      color: #ffffff; 
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content { 
      padding: 30px; 
      font-size: 18px;
    }
    .newsletter-content h2 { 
      color: #2c3e50; 
      border-bottom: 2px solid #3498db; 
      padding-bottom: 10px; 
      margin-top: 30px;
      font-size: 24px;
    }
    .newsletter-content .summary { 
      margin-bottom: 20px; 
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 5px;
    }
    .newsletter-content .takeaways { 
      padding-left: 20px; 
      background-color: #e8f6fe;
      padding: 20px 20px 20px 40px;
      border-radius: 5px;
    }
    .newsletter-content .quotes { 
      font-style: italic; 
      color: #34495e; 
      background-color: #f0f4f7;
      padding: 20px;
      border-left: 4px solid #3498db;
      margin: 20px 0;
    }
    .footer { 
      background-color: #34495e; 
      padding: 20px; 
      text-align: center; 
      font-size: 0.9em; 
      color: #ecf0f1;
    }
    .image-container { 
      text-align: center;
      margin-bottom: 20px;
    }
    img { 
      max-width: 100%; 
      height: auto; 
      border-radius: 5px;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .video-info {
      background-color: #eaf6fd;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 20px;
      font-size: 18px;
    }
    .video-info p {
      margin: 0;
    }
    .watch-button {
      display: inline-block;
      color: #ffffff; 
      background-color: #3498db;
      padding: 12px 24px;
      border-radius: 5px;
      text-decoration: none;
      margin-top: 20px;
      margin-bottom: 30px;
      font-size: 18px;
      text-align: center;
    }
    .watch-button:hover {
      background-color: #2980b9;
      text-decoration: none;
    }
    
    @media only screen and (max-width: 600px) {
      body {
        font-size: 14px;
      }
      .container {
        margin: 10px;
        width: auto;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 15px;
      }
      .newsletter-content h2 {
        font-size: 20px;
      }
      .video-info {
        font-size: 16px;
      }
      .watch-button {
        font-size: 16px;
        padding: 10px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Newsletter: ${videoDetails.title}</h1>
    </div>
    <div class="content">
      <div class="image-container">
        <img src="${videoDetails.thumbnailLink}" alt="${videoDetails.title}" />
      </div>
      <div class="video-info">
        <p><strong>Channel:</strong> ${videoDetails.channelTitle}</p>
        <p><strong>Published:</strong> ${new Date(videoDetails.publishedAt).toLocaleDateString()}</p>
      </div>
      <div class="newsletter-content">
        ${newsletter}
      </div>
      <a href="https://www.youtube.com/watch?v=${videoId}" >
      <div>
      Watch the full video
      <div>
      </a>
    </div>
    <div class="footer">
      <p>This newsletter is generated based on the latest video from your subscribed channels.</p>
    </div>
  </div>
</body>
</html>
`;