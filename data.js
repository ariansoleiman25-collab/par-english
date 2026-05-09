const mcqQuestions = [
  {q:"A website needs a server to work online. This is called:",o:["Coding","Web hosting","Designing","Printing"],a:1},
  {q:"My laptop is ____ than yours.",o:["fast","faster","fastest","more fastest"],a:1},
  {q:"Choose the polite sentence:",o:["Give me the file.","Send it now.","Could you send the file?","You send the file."],a:2},
  {q:"Software licenses usually cost:",o:["Time","Money","Color","Space"],a:1},
  {q:"Choose the passive sentence:",o:["She installs the app.","The app is installed.","She is installing the app.","She installed the app."],a:1},
  {q:"This is the ____ computer in the office.",o:["good","better","best","most better"],a:2},
  {q:"Companies use enterprise social media to:",o:["Communicate","Cook","Travel","Sleep"],a:0},
  {q:"They ____ the system now.",o:["fix","fixed","are fixing","have fixed"],a:2},
  {q:"It is important to:",o:["Share passwords","Use strong passwords","Ignore updates","Turn off antivirus"],a:1},
  {q:"Choose the correct recommendation:",o:["You should update your PC.","You update your PC.","You updated your PC.","You updating your PC."],a:0},
  {q:"The system ____ be secure.",o:["likes","must","plays","eats"],a:1},
  {q:"The error caused the program to:",o:["run","stop","buy","read"],a:1},
  {q:"Shared hosting means:",o:["One server for many websites","One computer for one user","One email for one person","One file for one folder"],a:0},
  {q:"This software is ____ than the old one.",o:["more useful","useful","most useful","usefully"],a:0},
  {q:"Monthly cloud services are called:",o:["salary","subscription fees","homework","hardware"],a:1},
  {q:"Prices are ____ every year.",o:["increase","increasing","increased","increases"],a:1},
  {q:"Choose the formal request:",o:["Open the door.","Can you open the door, please?","Open door now.","You open the door."],a:1},
  {q:"I ____ finished my work.",o:["have","has","had","having"],a:0},
  {q:"Choose the suggestion:",o:["We installed new software.","We could upgrade the server.","We upgrade the server.","We upgraded the server."],a:1},
  {q:"She wants to ____ a programmer.",o:["become","eat","drive","sleep"],a:0},
  {q:"The report was ____ yesterday.",o:["write","written","writing","writes"],a:1},
  {q:"This task is the ____ one.",o:["easy","easier","easiest","more easy"],a:2},
  {q:"An internal chat tool is used for:",o:["company communication","cooking","shopping","sports"],a:0},
  {q:"Hardware costs include:",o:["computers","emails","passwords","websites"],a:0},
  {q:"You ____ back up your files.",o:["should","are","did","was"],a:0},
  {q:"We need more:",o:["storage","weather","music","coffee"],a:0},
  {q:"I was studying when he ____ me.",o:["calls","called","calling","call"],a:1},
  {q:"A domain name is used to:",o:["identify a website","fix hardware","print files","store emails"],a:0},
  {q:"It is unsafe to:",o:["lock your screen","update software","share passwords","use antivirus"],a:2},
  {q:"This phone is ____ than mine.",o:["expensive","more expensive","most expensive","expensively"],a:1},
  {q:"The noise made me:",o:["wake up","buy","code","download"],a:0},
  {q:"Technology is changing:",o:["slowly","fast","fastly","fastest"],a:1},
  {q:"Choose the polite option:",o:["Give me that file.","Could you help me?","Help me now.","You help me."],a:1},
  {q:"I have never ____ to London.",o:["went","go","been","going"],a:2},
  {q:"Let's ____ a new system.",o:["install","installed","installing","installs"],a:0},
  {q:"He plans to:",o:["apply for a job","eat a job","sleep a job","drive a job"],a:0},
  {q:"The email was ____ by the manager.",o:["send","sent","sending","sends"],a:1},
  {q:"Training employees costs:",o:["money","colors","chairs","air"],a:0},
  {q:"She is the ____ student in class.",o:["smart","smarter","smartest","more smart"],a:2},
  {q:"A VPS is:",o:["virtual private server","video player system","visual photo software","virtual personal site"],a:0},
  {q:"It helps teams to:",o:["collaborate","sleep","cook","drive"],a:0},
  {q:"It's better to:",o:["update your antivirus","ignore viruses","share passwords","delete backups"],a:0},
  {q:"The app should be:",o:["fast","slow","noisy","heavy"],a:0},
  {q:"We are ____ a meeting.",o:["have","having","had","has"],a:1},
  {q:"You should sit:",o:["correctly","dangerously","loudly","wrongly"],a:0},
  {q:"This task is ____ than the last one.",o:["difficult","more difficult","most difficult","difficulty"],a:1},
  {q:"Why don't we:",o:["restart the server?","restarted the server?","restarting the server?","restarts the server?"],a:0},
  {q:"She has ____ the report.",o:["finish","finished","finishing","finishes"],a:1},
  {q:"Buying new computers is a:",o:["cost","hobby","sport","game"],a:0},
  {q:"He wants to ____ his skills.",o:["develop","eat","forget","break"],a:0}
];

const fillQuestions = [
  {
    id:"q1",
    title:"Q1 / Complete these definitions with the words in the box.",
    words:["approve","analyse","debug","detail","interview"],
    items:[
      {text:"all the separate features and pieces of information about something",answer:"detail"},
      {text:"think about something very carefully, step-by-step",answer:"analyse"},
      {text:"officially say that you are happy with something",answer:"approve"},
      {text:"ask someone questions formally in order to find out information",answer:"interview"},
      {text:"find problems in a computer program and correct them",answer:"debug"}
    ]
  },
  {
    id:"q2",
    title:"Q2 / Complete these definitions with the words in the box.",
    words:["alpha testing","beta testing","coding","feedback","milestone","release candidate"],
    items:[
      {text:"writing software",answer:"coding"},
      {text:"an important stage in a project",answer:"milestone"},
      {text:"the first stage of testing software",answer:"alpha testing"},
      {text:"the second stage of testing software",answer:"beta testing"},
      {text:"information about problems or how good something is",answer:"feedback"},
      {text:"the final version of software, if no big bugs are found",answer:"release candidate"}
    ]
  },
  {
    id:"q3",
    title:"Q3 / Find words in the form that match these definitions.",
    words:["escalate","ticket","issue tracking system","tier"],
    items:[
      {text:"software for looking after help desk enquiries",answer:"issue tracking system"},
      {text:"record of a customer's problem or question",answer:"ticket"},
      {text:"level",answer:"tier"},
      {text:"pass the problem to a higher level technician with more training",answer:"escalate"}
    ]
  },
  {
    id:"q4",
    title:"Q4 / Complete these sentences with words in the box.",
    words:["connection error","crashes","failure","fault","hanging","running slowly"],
    items:[
      {text:"The application is ____.",answer:"hanging"},
      {text:"The computer ____.",answer:"crashes"},
      {text:"There is a ____.",answer:"connection error"},
      {text:"The computer is ____.",answer:"running slowly"},
      {text:"The speaker had a disk ____.",answer:"failure"},
      {text:"The speaker's mobile phone has a ____.",answer:"fault"}
    ]
  },
  {
    id:"q5",
    title:"Q5 / Complete these glossary definitions with the words in the box.",
    words:["(data) compression","dedicated system","MCU","remote control"],
    items:[
      {text:"a system that is used for only one purpose, e.g. for video conferencing only",answer:"dedicated system"},
      {text:"a device that can control the video conferencing system from a distance, without wires",answer:"remote control"},
      {text:"a device that allows video conferencing systems to use more than two locations",answer:"MCU"},
      {text:"a way to fit audio or video into a smaller space and use less bandwidth",answer:"(data) compression"}
    ]
  }
];
