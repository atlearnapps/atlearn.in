import React from 'react';

const CourseCard = ({ course }) => (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white border border-gray-200 p-4 mb-4">
      {course.overviewfiles && course.overviewfiles[0]?.fileurl ? (
        <img
          className="w-full h-48 object-cover"
          src={`${course.overviewfiles[0].fileurl}?token=4d7227a20cac833e068c7ac469200c75`} // Add token here if needed
          alt={course.fullname}
          onError={(e) => { e.target.style.display = 'none'; }} // Fallback if image fails
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}

        {/* Course Details */}
        <div className="p-4">
            <h2 className="font-bold text-xl mb-2">{course.fullname}</h2>
            <p className="text-gray-700 text-base mb-2">{course.summary || 'No description available.'}</p>
            <div className="text-sm text-gray-500 mb-2">
                <span className="font-semibold">Category:</span> {course.categoryname || 'N/A'}
            </div>
            
            {/* Contacts */}
            {course.contacts.length > 0 && (
                <div className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Contacts:</span>
                    <ul>
                        {course.contacts.map(contact => (
                            <li key={contact.id}>{contact.fullname}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Enrollment Methods */}
            {course.enrollmentmethods.length > 0 && (
                <div className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Enrollment Methods:</span> {course.enrollmentmethods.join(', ')}
                </div>
            )}

            {/* Course Dates */}
            <div className="text-sm text-gray-500">
                <span className="font-semibold">Start Date:</span> {new Date(course.startdate * 1000).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500">
                <span className="font-semibold">End Date:</span> {new Date(course.enddate * 1000).toLocaleDateString()}
            </div>
        </div>
    </div>
);

const CourseList = ({ courses }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
        {courses.map(course => (
            <CourseCard key={course.id} course={course} />
        ))}
    </div>
);

const CourseApp = () => {
    const courses=[
        {
            "id": 1,
            "fullname": "lms.atlearn.in",
            "displayname": "lms.atlearn.in",
            "shortname": "lms.atlearn.in",
            "categoryid": 0,
            "categoryname": "",
            "sortorder": 1,
            "summary": "",
            "summaryformat": 1,
            "summaryfiles": [],
            "overviewfiles": [],
            "showactivitydates": false,
            "showcompletionconditions": null,
            "contacts": [],
            "enrollmentmethods": [],
            "idnumber": "",
            "format": "site",
            "showgrades": 1,
            "newsitems": 3,
            "startdate": 0,
            "enddate": 0,
            "maxbytes": 0,
            "showreports": 0,
            "visible": 1,
            "groupmode": 0,
            "groupmodeforce": 0,
            "defaultgroupingid": 0,
            "enablecompletion": 0,
            "completionnotify": 0,
            "lang": "",
            "theme": "",
            "marker": 0,
            "legacyfiles": 0,
            "calendartype": "",
            "timecreated": 1726289455,
            "timemodified": 1729172289,
            "requested": 0,
            "cacherev": 1730097334,
            "filters": [
                {
                    "filter": "displayh5p",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "activitynames",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "mathjaxloader",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "emoticon",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "urltolink",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "mediaplugin",
                    "localstate": 0,
                    "inheritedstate": 1
                }
            ]
        },
        {
            "id": 2,
            "fullname": "Physics",
            "displayname": "Physics",
            "shortname": "physics",
            "categoryid": 2,
            "categoryname": "Sciences",
            "sortorder": 20002,
            "summary": "<p dir=\"ltr\" style=\"text-align:left;\">Welcome to LMS</p>",
            "summaryformat": 1,
            "summaryfiles": [],
            "overviewfiles": [
                {
                    "filename": "physics (1).jpg",
                    "filepath": "/",
                    "filesize": 201928,
                    "fileurl": "https://lms.atlearn.in/webservice/pluginfile.php/15/course/overviewfiles/physics%20%281%29.jpg",
                    "timemodified": 1726469772,
                    "mimetype": "image/jpeg"
                }
            ],
            "showactivitydates": true,
            "showcompletionconditions": true,
            "contacts": [
                {
                    "id": 7,
                    "fullname": "Teacher One"
                },
                {
                    "id": 5,
                    "fullname": "Student Two"
                },
                {
                    "id": 8,
                    "fullname": "Teacher Two"
                }
            ],
            "enrollmentmethods": [
                "manual",
                "guest",
                "self"
            ],
            "idnumber": "CID001",
            "format": "topics",
            "showgrades": 1,
            "newsitems": 5,
            "startdate": 1726351200,
            "enddate": 1765753200,
            "maxbytes": 0,
            "showreports": 0,
            "visible": 1,
            "groupmode": 0,
            "groupmodeforce": 0,
            "defaultgroupingid": 0,
            "enablecompletion": 1,
            "completionnotify": 0,
            "lang": "",
            "theme": "",
            "marker": 0,
            "legacyfiles": 0,
            "calendartype": "",
            "timecreated": 1726294397,
            "timemodified": 1726469772,
            "requested": 0,
            "cacherev": 1730097334,
            "filters": [
                {
                    "filter": "displayh5p",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "activitynames",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "mathjaxloader",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "emoticon",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "urltolink",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "mediaplugin",
                    "localstate": 0,
                    "inheritedstate": 1
                }
            ],
            "courseformatoptions": [
                {
                    "name": "hiddensections",
                    "value": 1
                },
                {
                    "name": "coursedisplay",
                    "value": 0
                },
                {
                    "name": "indentation",
                    "value": "1"
                }
            ]
        },
        {
            "id": 3,
            "fullname": "Chemistry",
            "displayname": "Chemistry",
            "shortname": "chemistry",
            "categoryid": 2,
            "categoryname": "Sciences",
            "sortorder": 20001,
            "summary": "Welcome to LMS",
            "summaryformat": 1,
            "summaryfiles": [],
            "overviewfiles": [
                {
                    "filename": "image002.jpg",
                    "filepath": "/",
                    "filesize": 312671,
                    "fileurl": "https://lms.atlearn.in/webservice/pluginfile.php/16/course/overviewfiles/image002.jpg",
                    "timemodified": 1726469720,
                    "mimetype": "image/jpeg"
                }
            ],
            "showactivitydates": true,
            "showcompletionconditions": true,
            "contacts": [
                {
                    "id": 7,
                    "fullname": "Teacher One"
                }
            ],
            "enrollmentmethods": [
                "manual",
                "self"
            ],
            "idnumber": "CID002",
            "format": "topics",
            "showgrades": 1,
            "newsitems": 5,
            "startdate": 1726351200,
            "enddate": 1765753200,
            "maxbytes": 0,
            "showreports": 0,
            "visible": 1,
            "groupmode": 0,
            "groupmodeforce": 0,
            "defaultgroupingid": 0,
            "enablecompletion": 1,
            "completionnotify": 0,
            "lang": "",
            "theme": "",
            "marker": 0,
            "legacyfiles": 0,
            "calendartype": "",
            "timecreated": 1726294431,
            "timemodified": 1729262403,
            "requested": 0,
            "cacherev": 1730097334,
            "filters": [
                {
                    "filter": "displayh5p",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "activitynames",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "mathjaxloader",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "emoticon",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "urltolink",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "mediaplugin",
                    "localstate": 0,
                    "inheritedstate": 1
                }
            ],
            "courseformatoptions": [
                {
                    "name": "hiddensections",
                    "value": 1
                },
                {
                    "name": "coursedisplay",
                    "value": 0
                },
                {
                    "name": "indentation",
                    "value": "1"
                }
            ]
        },
        {
            "id": 4,
            "fullname": "Artificial Intelligence A-Z 2024: Build 7 AI + LLM &amp; ChatGPT",
            "displayname": "Artificial Intelligence A-Z 2024: Build 7 AI + LLM &amp; ChatGPT",
            "shortname": "Artificial Intelligence A-Z 2024",
            "categoryid": 3,
            "categoryname": "Technology",
            "sortorder": 30002,
            "summary": "<p dir=\"ltr\" style=\"text-align:left;\">Welcome to Learning Management Systems.</p>",
            "summaryformat": 1,
            "summaryfiles": [],
            "overviewfiles": [
                {
                    "filename": "AI-Developer.jpg",
                    "filepath": "/",
                    "filesize": 130793,
                    "fileurl": "https://lms.atlearn.in/webservice/pluginfile.php/23/course/overviewfiles/AI-Developer.jpg",
                    "timemodified": 1726469531,
                    "mimetype": "image/jpeg"
                }
            ],
            "showactivitydates": true,
            "showcompletionconditions": true,
            "contacts": [],
            "enrollmentmethods": [
                "manual",
                "self"
            ],
            "idnumber": "tech001",
            "format": "topics",
            "showgrades": 1,
            "newsitems": 5,
            "startdate": 1726524000,
            "enddate": 1765926000,
            "maxbytes": 0,
            "showreports": 0,
            "visible": 1,
            "groupmode": 0,
            "groupmodeforce": 0,
            "defaultgroupingid": 0,
            "enablecompletion": 1,
            "completionnotify": 0,
            "lang": "",
            "theme": "",
            "marker": 0,
            "legacyfiles": 0,
            "calendartype": "",
            "timecreated": 1726469531,
            "timemodified": 1726470642,
            "requested": 0,
            "cacherev": 1730097334,
            "filters": [
                {
                    "filter": "displayh5p",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "activitynames",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "mathjaxloader",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "emoticon",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "urltolink",
                    "localstate": 0,
                    "inheritedstate": 1
                },
                {
                    "filter": "mediaplugin",
                    "localstate": 0,
                    "inheritedstate": 1
                }
            ],
            "courseformatoptions": [
                {
                    "name": "hiddensections",
                    "value": 1
                },
                {
                    "name": "coursedisplay",
                    "value": 0
                },
                {
                    "name": "indentation",
                    "value": "1"
                }
            ]
        },
      
    ]

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Available Courses</h1>
            <CourseList courses={courses} />
        </div>
    );
};

export default CourseApp;
