// ========================================
function optimizeProjects(action) {
// ========================================

    // REMOVE SELECTS ...
    var elements = $("select");
    $.each(elements, function(index, element) {
        element.remove();
    });

    Promise.all([
        getStudents(),
        getProjects(),
        getApplications(),

        // THIS COULD BE SIMPLIFIED TO A SINGLE DATABASE
        // QUERY THAT IS SPECIFIC TO THE FUNCTION.

    ]).then(function([students, projects, applications]) {
        var weights = getProjectWeights(applications);
        var min_students = parseInt($("#assignment-input-min").val());
        var max_students = parseInt($("#assignment-input-max").val());

        if (action == "minimize") {
            var m_students = maxProjectSize(
                students,
                projects,
                min_students,
                max_students,
            );
        };

        if (action  == "maximize") {
            var m_students = minProjectSize(
                students,
                projects,
                min_students,
                max_students,
            );
        };

        // IN THE EVENT THAT 'deficitProjectsAlert' FIRES, THE
        // RECURSIVE METHOD THAT GENERATES 'm_students' FAILED
        // TO FIND A OPTIMAL PROJECT SIZE BASED ON PARAMETERS.
        if (!m_students) {return deficitProjectsAlert()};

        var project_cnt = Number(m_students[0]);
        var project_sur = Number(m_students[1]);

        if (project_sur > 0) {
            if (!surplusProjectsConfirm) {
                return;
            };
        };

        var project_list = [];
        var priority_projects = getPriorityProjects(projects);
        priority_projects.forEach(function(project_id) {
            project_list.push(Number(project_id));
            delete weights[project_id];
        });

        while (project_cnt > project_list.length) {
            var popular_project = getPopularProject(weights);
            project_list.push(Number(popular_project));
            delete weights[popular_project];
        };

        project_list.sort(function(a, b) {
            return a - b;
        });

        var project_sizes = [];
        var project_size = Math.floor(students.length / project_cnt);
        for (var idx = 0; idx < project_cnt; idx++) {
            project_sizes.push(project_size);
        };

        var student_deficit = students.length - (project_size * project_cnt);
        for (var idx = 0; idx < student_deficit; idx++) {
            project_sizes[idx] += 1;
        };

        placeStudents(
            students,
            applications,
            project_sizes,
            project_list,
        );
    });
};

// ========================================
function placeStudents(s, a, ps, pl) {
// ========================================
//   KEY:  s = students
//         a = applications
//        ps = project_sizes
//        pl = project_list
// ========================================

    // A MORE SPECIFIC DATABASE QUERY COULD POTENTIALLY
    // INCREASE THE SPEED OF THIS FUNCTION BY REDUCING
    // THE FOLLOWING LOOP TO O(n) or O(n^2).

    var munkres_matrix = [];
    s.forEach(function(student, i) {
        var preferences = [];
        pl.forEach(function(project, j) {
            a.forEach(function(application, k) {
                if (project == application.Project_ID) {
                    if (student.Student_ID == application.Student_ID) {
                        preferences = preferences.concat(
                            Array(ps[j]).fill(application.Preference_Order)
                        );
                    };
                };
            });
        });
        munkres_matrix.push(preferences);
    });

    var project_keys = [];
    pl.forEach(function(project, i) {
        project_keys = project_keys.concat(
            Array(ps[i]).fill(project)
        );
    });

    var invalid_matrix = false;
    var invalid_students = [];
    munkres_matrix.forEach(function(a, i) {
        if (a.length != project_keys.length) {
            var student = `${s[i].FirstName} ${s[i].LastName}`;
            invalid_students.push(student);
            invalid_matrix = true;
        };
    });

    if (invalid_matrix) {
        console.log("");
        console.warn("Missing Applications:")
        invalid_students.forEach(function(student) {
            console.log(" -", student);
        }); return missingApplicationsAlert();
    };

    var m = new Munkres();
    var indices = m.compute(munkres_matrix);
    indices.forEach(function(result, i) {
        var student_id = `${s[i].Student_ID}`;
        var project_id = `${project_keys[result[1]]}`;

        var data = {
            Project_ID: `${project_id}`,
            Student_ID: `${student_id}`,
            Students: {},
        };

        data.Students = s.map(function(student) {
            return student;
        });

        renderAssignmentSelect(
            data,
            student_id,
            project_id,
        );
    });
};

// ========================================
function assignStudents() {
// ========================================
    var data = $("#assignment-form").serializeArray();

    if (hasDuplicates(data)) {
        return duplicateStudentsAlert();
    };

    data.forEach(function(assignment, i) {
        var project_id = assignment.name;
        var student_id = assignment.value;

        var query = `

            INSERT INTO
                project_assignment

            VALUES (
                '${student_id}',
                '${project_id}'
            )`;

        postResults(query).done(function() {
            refreshPage();
        });
    });
};

// ========================================
function updateStudents() {
// ========================================
    var data = $("#assignment-form").serializeArray();

    if (hasDuplicates(data)) {
        return duplicateStudentsAlert();
    };

    data.forEach(function(assignment, i) {
        var project_id = assignment.name;
        var student_id = assignment.value;

        var query = `

            UPDATE
                project_assignment

            SET
                Project_ID = '${project_id}'

            WHERE
                Student_ID = '${student_id}'
        `;

        postResults(query).done(function() {
            refreshPage();
        });
    });
};

// ========================================
function resetStudents() {
// ========================================
    var query = `

        TRUNCATE TABLE
            project_assignment

    `; postResults(query).done(function() {
        refreshPage();
    });
};

// ========================================
//      GETTERS
// ========================================

function getProjectWeights(applications) {
    var weights = {};
    applications.forEach(function(application) {
        switch(Number(application.Preference_Order)) {

            case 1: weights[application.Project_ID] = (
                weights[application.Project_ID] || 0
            ) + 1; break;

            case 2: weights[application.Project_ID] = (
                weights[application.Project_ID] || 0
            ) + 1/2; break;

            case 3: weights[application.Project_ID] = (
                weights[application.Project_ID] || 0
            ) + 1/3; break;
        };
    });
    return weights;
};

function getPriorityProjects(projects) {
    var priority_projects = [];
    projects.forEach(function(project) {
        if (project.Title.includes("*")) {
            priority_projects.push(project.Project_ID);
        };
    });
    return priority_projects;
};

function getPopularProject(weights) {
    return Object.keys(weights).reduce(function(a, b) {
        return weights[a] > weights[b] ? a : b;
    });
};

// ========================================
//      RECURSIVE FUNCTIONS
// ========================================

function minProjectSize(s, p, min_students, max_students) {
    var project_cnt = Math.ceil(s.length / min_students);
    var project_sur = p.length - project_cnt;

    if (0 <= project_sur) {
        return [project_cnt, project_sur, min_students];
    };

    if (0 > project_sur) {
        if (min_students < max_students) {
            min_students += 1;
            return minProjectSize(s, p, min_students, max_students);
        } else {
            return false;
        };
    };
};

function maxProjectSize(s, p, min_students, max_students) {
    var project_cnt = Math.ceil(s.length / max_students);
    var project_sur = p.length - project_cnt;

    if (0 <= project_sur) {
        return [project_cnt, project_sur, max_students];
    };

    if (0 > project_sur) {
        if (max_students > min_students) {
            max_students -= 1;
            return minProjectSize(s, p, min_students, max_students);
        } else {
            return false;
        };
    };
};

// ========================================
//      MISCELLANEOUS FUNCTIONS
// ========================================

function hasDuplicates(data) {
    var values = data.map(function(i) {return i.value});
    return new Set(values).size != values.length;
};
