import { Course, CourseSelection } from "./course";

/**
 * Returns a list of requirements that are satisfied
 */
export function verifyRequirements(
  selectedCourses: CourseSelection[]
): string[] {
  //<String, String[]>
  //maps "semester/year" to list of courses
  const mapper = new Map<string, Course[]>();

  //contains all keys used in the map
  const keyspace: string[] = [];

  // enhanced for loop this into this format
  //    {“semester/year” → [courses]}

  selectedCourses.forEach((element) => {
    const course = element.course;
    const sem = element.semester;
    const year = element.year;

    const combin = sem + "/" + year;

    if (keyspace.indexOf(combin) == -1) {
      keyspace.push(combin);
    }

    if (mapper.has(combin)) {
      mapper.get(combin).push(course);
    } else {
      mapper.set(combin, []);
      mapper.get(combin).push(course);
    }
  }); //end of enhanced for loop

  /* Generate list of “grad requirements”
        - General requirements:
            -CS 125, 126, 173, 225, 233, 241, 357, 361, 374, 421
        - COMPUTER SCIENCE TECHNICAL AND ADVANCED ELECTIVES [at least 6 courses with at least 18 credit hours total]
            -Team project requirement [1 course]
            -Focus areas [at least 3 courses in one subcategory]
-General Advanced Electives [minimum of 6.0 credit hours needed]    
    */

  // grad requirements go here, these are bool flags
  //define the "basic requirements" rule here

  //must meet all fields in pt1, and one field in pt2
  const BASIC_REQUIREMENTS_test_pt1 = new Map([
    ["CS125", false],
    ["CS173", false],
    ["CS210", false],
    ["CS225", false],
    ["CS233", false],
    ["CS241", false],
    ["CS357", false],
    ["CS361", false],
    ["CS374", false],
    ["CS421", false],
  ]);

  const BASIC_REQUIREMENTS_test_pt2 = new Map([
    ["CS126", false],
    ["CS242", false],
  ]);

  //for adv requirements, we need a min of 6 courses, 18 credit hours min, and other reqs

  //problem is, at least 2 courses -> at least 6 hours, are any 400s level course
  //we can suggest at least 12 hours are met? but cannot enforce the full 18 here

  //get one of these true
  //TODO: find out how these are flagged as course titles - 498 is wonky
  // CS498 sections: Virtual Reality, Internet of Things , ISE - IoT Software Engineering
  const TEAM_PROJ_test = new Map([
    ["CS427", false],
    ["CS428", false],
    ["CS429", false],
    ["CS465", false],
    ["CS467", false],
    ["CS493", false],
    ["CS494", false],
    ["CS497", false],
  ]);

  //add a flag set per focus area

  //for SOFT - CS_498 (Art and Science of Web Prog.), 498 (Logic), 498 (Applied Cryptography), 498 (Software Testing) to add
  // also add CS_598 (Verification), 598 (Languages)
  const FOCUS_SOFTWARE = new Map([
    ["CS422", false],
    ["CS426", false],
    ["CS427", false],
    ["CS428", false],
    ["CS429", false],
    ["CS476", false],
    ["CS477", false],
    ["CS492", false],
    ["CS493", false],
    ["CS494", false],
    ["CS522", false],
    ["CS524", false],
    ["CS526", false],
    ["CS527", false],
    ["CS528", false],
    ["CS576", false],
  ]);

  //add these: 498 (Logic), 498 (Parallel Algorithms), 498 (Computational Geometry), 598 (Crypto)
  const FOCUS_ALGO = new Map([
    ["CS413", false],
    ["CS473", false],
    ["CS475", false],
    ["CS476", false],
    ["CS477", false],
    ["CS481", false],
    ["CS482", false],
    ["CS571", false],
    ["CS572", false],
    ["CS573", false],
    ["CS574", false],
    ["CS575", false],
    ["CS576", false],
    ["CS579", false],
    ["CS583", false],
    ["CS584", false],
  ]);

  //add these:
  //498 (Data Visualization), 498 (Deep Learning), 498 (Applied Machine Learning), 498 (Social & Info. Networks),
  //498 (Cyber Dystopia), 498 (Data Science & Analytics), 598 (Machine Learning & Signal Proc.)
  const FOCUS_INTELL = new Map([
    ["CS410", false],
    ["CS411", false],
    ["CS412", false],
    ["CS414", false],
    ["CS440", false],
    ["CS443", false],
    ["CS445", false],
    ["CS446", false],
    ["CS447", false],
    ["CS466", false],
    ["CS467", false],
    ["CS510", false],
    ["CS511", false],
    ["CS512", false],
    ["CS543", false],
    ["CS544", false],
    ["CS546", false],
    ["CS548", false],
    ["CS566", false],
    ["CS576", false],
  ]);

  //add these:
  //498 (Art and Science of Web Prog.), 498 (Computational Advertising), 498 (Data Visualization)
  //498 (Applied Machine Learning), 498 (HCI), 498 (Social & Information Networks), CS 498 (Virtual Reality),
  //498 (Cyber Dystopia), 498 (Cyber Physical Systems), 498 (Data Science & Analytics), 498 (Smart Cities),
  //498 (Learning and Computer Science), 498 (Online Learning Sys), 498 (Mobile Interactive Design),
  const FOCUS_HUMAN = new Map([
    ["CS460", false],
    ["CS461", false],
    ["CS463", false],
    ["CS465", false],
    ["CS467", false],
    ["CS468", false],
    ["CS563", false],
    ["CS565", false],
  ]);

  //add these:
  //498 (Art and Science of Web Prog.), 498 (Computational Advertising), 498 (Virtual Reality)
  //498 (Data Visualization), 498 (Audio Computing Lab),
  //598 (Machine Learning & Signal Proc.)
  const FOCUS_MEDIA = new Map([
    ["CS414", false],
    ["CS418", false],
    ["CS419", false],
    ["CS445", false],
    ["CS465", false],
    ["CS467", false],
    ["CS468", false],
    ["CS519", false],
    ["CS565", false],
  ]);

  //add this: 498 (Parallel Algorithms),
  const FOCUS_SCI = new Map([
    ["CS419", false],
    ["CS450", false],
    ["CS457", false],
    ["CS466", false],
    ["CS482", false],
    ["CS483", false],
    ["CS484", false],
    ["CS519", false],
    ["CS554", false],
    ["CS555", false],
    ["CS556", false],
    ["CS558", false],
  ]);

  //add these:
  //498 (Wireless Network Labs),  498 (Digital Forensics), 498 (Digital Forensics II), 498 (Applied Cryptography),
  //498 (Cyber Physical Systems), 498 (Internet of Things), 498 (Smart Cities)
  const FOCUS_DIST = new Map([
    ["CS423", false],
    ["CS424", false],
    ["CS425", false],
    ["CS431", false],
    ["CS436", false],
    ["CS438", false],
    ["CS439", false],
    ["CS460", false],
    ["CS461", false],
    ["CS463", false],
    ["CS483", false],
    ["CS484", false],
    ["CS523", false],
    ["CS524", false],
    ["CS525", false],
    ["CS538", false],
    ["CS563", false],
  ]);

  //add these:
  //498 (Internet of Things), 498 (Digital Forensics), 498 (Digital Forensics II),
  //598 (Parallel)
  const FOCUS_MACHINES = new Map([
    ["CS423", false],
    ["CS424", false],
    ["CS426", false],
    ["CS431", false],
    ["CS433", false],
    ["CS484", false],
    ["CS523", false],
    ["CS526", false],
    ["CS533", false],
    ["CS536", false],
    ["CS541", false],
    ["CS584", false],
  ]);

  const REVERSE_LOOKUP = new Map<string, Map<string, boolean>[]>();

  for (const key of FOCUS_ALGO.keys()) {
    if (REVERSE_LOOKUP.has(key)) REVERSE_LOOKUP.get(key).push(FOCUS_ALGO);
    else {
      REVERSE_LOOKUP.set(key, []);
      REVERSE_LOOKUP.get(key).push(FOCUS_ALGO);
    }
  }

  for (const key of FOCUS_DIST.keys()) {
    if (REVERSE_LOOKUP.has(key)) REVERSE_LOOKUP.get(key).push(FOCUS_DIST);
    else {
      REVERSE_LOOKUP.set(key, []);
      REVERSE_LOOKUP.get(key).push(FOCUS_DIST);
    }
  }

  for (const key of FOCUS_HUMAN.keys()) {
    if (REVERSE_LOOKUP.has(key)) REVERSE_LOOKUP.get(key).push(FOCUS_HUMAN);
    else {
      REVERSE_LOOKUP.set(key, []);
      REVERSE_LOOKUP.get(key).push(FOCUS_HUMAN);
    }
  }

  for (const key of FOCUS_INTELL.keys()) {
    if (REVERSE_LOOKUP.has(key)) REVERSE_LOOKUP.get(key).push(FOCUS_INTELL);
    else {
      REVERSE_LOOKUP.set(key, []);
      REVERSE_LOOKUP.get(key).push(FOCUS_INTELL);
    }
  }

  for (const key of FOCUS_MACHINES.keys()) {
    if (REVERSE_LOOKUP.has(key)) REVERSE_LOOKUP.get(key).push(FOCUS_MACHINES);
    else {
      REVERSE_LOOKUP.set(key, []);
      REVERSE_LOOKUP.get(key).push(FOCUS_MACHINES);
    }
  }

  for (const key of FOCUS_MEDIA.keys()) {
    if (REVERSE_LOOKUP.has(key)) REVERSE_LOOKUP.get(key).push(FOCUS_MEDIA);
    else {
      REVERSE_LOOKUP.set(key, []);
      REVERSE_LOOKUP.get(key).push(FOCUS_MEDIA);
    }
  }

  for (const key of FOCUS_SCI.keys()) {
    if (REVERSE_LOOKUP.has(key)) REVERSE_LOOKUP.get(key).push(FOCUS_SCI);
    else {
      REVERSE_LOOKUP.set(key, []);
      REVERSE_LOOKUP.get(key).push(FOCUS_SCI);
    }
  }

  for (const key of FOCUS_SOFTWARE.keys()) {
    if (REVERSE_LOOKUP.has(key)) REVERSE_LOOKUP.get(key).push(FOCUS_SOFTWARE);
    else {
      REVERSE_LOOKUP.set(key, []);
      REVERSE_LOOKUP.get(key).push(FOCUS_SOFTWARE);
    }
  }

  for (const key of TEAM_PROJ_test.keys()) {
    if (REVERSE_LOOKUP.has(key)) REVERSE_LOOKUP.get(key).push(TEAM_PROJ_test);
    else {
      REVERSE_LOOKUP.set(key, []);
      REVERSE_LOOKUP.get(key).push(TEAM_PROJ_test);
    }
  }

  //var ADVANCED_REQUIREMENTS = TEAM_PROJ && (one of these focuses --> at least 3 courses)

  let credits_total = 0;
  let cs_elective_course_total = 0;
  const to_check: Map<string, boolean>[] = [];
  // for each key
  keyspace.forEach((key) => {
    // get the list of classes associated with it
    const temp_list = mapper.get(key);

    // for each class
    temp_list.forEach((element) => {
      //manually check each dict/flag
      const course_name = element.name;
      const credits = element.creditHours;

      //check each map for the course name as a key -> set flag to true if it exists
      if (BASIC_REQUIREMENTS_test_pt1.has(course_name)) {
        BASIC_REQUIREMENTS_test_pt1.set(course_name, true);
      } else if (BASIC_REQUIREMENTS_test_pt2.has(course_name)) {
        BASIC_REQUIREMENTS_test_pt2.set(course_name, true);
      }
      //if neither of these, it's an elective course

      if (REVERSE_LOOKUP.has(course_name)) {
        const list_of_targets = REVERSE_LOOKUP.get(course_name);

        list_of_targets.forEach((reqs_satisfied) => {
          reqs_satisfied.set(course_name, true);
          to_check.push(reqs_satisfied);
        });

        credits_total += credits;
        cs_elective_course_total += 1;
      }
    });
  });

  //last stage - return list of fulfilled requirements
  const list_of_reqs_met = [];

  let basic_flag = true;

  for (const value of BASIC_REQUIREMENTS_test_pt1.values()) {
    if (value == false) {
      basic_flag = false;
    }
  }

  let pt2_count = 0;
  if (basic_flag != false) {
    for (const value of BASIC_REQUIREMENTS_test_pt2.values()) {
      if (value == true) pt2_count += 1;
    }
  }

  if (basic_flag && pt2_count >= 1) {
    list_of_reqs_met.push("Basic requirement");
  }

  //for advanced reqs, one team project + one focus [3 courses in it]
  let TEAM_PROJ_flag = false;
  for (const value of TEAM_PROJ_test.values()) {
    if (value == true) {
      TEAM_PROJ_flag = true;
      break;
    }
  }

  let FOCUS_flag = false;
  to_check.forEach((element) => {
    let count = 0;
    for (const value of element.values()) {
      if (value == true) {
        count += 1;
      }
    }
    if (count >= 3) {
      FOCUS_flag = true;
    }
  });

  if (
    FOCUS_flag &&
    TEAM_PROJ_flag &&
    credits_total >= 18 &&
    cs_elective_course_total >= 6
  ) {
    list_of_reqs_met.push("Advanced requirement");
  }

  //split off requirements into smaller focuses/team project to add to list
  //check if list of focuses can replace maps
  //ignore 498s for now

  return list_of_reqs_met;

  //throw new Error("method not implemented");
}
