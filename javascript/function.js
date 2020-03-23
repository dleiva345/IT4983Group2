$(document).ready(function() {

    var location = window.location.href.split("/").pop();

    // CACHE MUSTACHE TEMPLATES
    Mustache.parse("./templates/assignment-table.htm");
    Mustache.parse("./templates/preference-select.htm");
    Mustache.parse("./templates/preference-table.htm");

// ========================================
//      LOAD HANDLERS
// ========================================

    if (location.includes("preference")) {
        var disabled = [
            $("#preference-button-apply"),
            $("#preference-button-update"),
        ]; disableElements(disabled);

        $("section#preference").show();
        renderPreferenceSelect();
    };

    if (location.includes("assignment")) {
        var disabled = [
            $("#assignment-input-min"),
            $("#assignment-input-max"),
            $("#assignment-button-minimize"),
            $("#assignment-button-maximize"),
            $("#assignment-button-assign"),
            $("#assignment-button-update"),
            $("#assignment-button-reset"),
        ]; disableElements(disabled);

        $("section#assignment").show();
        renderAssignmentPage();
    };

// ========================================
//      EVENT HANDLERS
// ========================================

    $("#preference-select").change(function() {
        var elements = $(".preference-tr-result");
        $.each(elements, function(index, element) {
            element.remove();
        });

        var disabled = [
            $("#preference-button-apply"),
            $("#preference-button-update"),
        ]; disableElements(disabled);

        if (!$(this).val()) {
            $("#preference-table").append(`
                <tr class ="preference-tr-result">
                    <td colspan="5">There is no table data to display.</td>
                </tr>
            `);
        } else {
            renderPreferenceTable($(this).val());
        };

    });

    $("#preference-button-submit").click(function() {
        var date = moment().format('YYYY-MM-DD HH:mm:ss');
        var data = $("#preference-form").find('tr:has(:radio:checked)').map(function() {
            var $row = $(this); var radio = $row.find(':radio:checked')[0];
            return {
                id: $row.data('application'),
                name: radio.name,
                value: radio.value,
            };
        }).get();

        data.forEach(function(application) {
            var student_id = $("#preference-select").val();
            var project_id = application.name;
            var preference = application.value;
            var application_id = application.id;

            if (application_id) {
                var query = `

                    UPDATE
                        project_application

                    SET
                        Preference_Order = '${preference}',
                        Date = '${date}'

                    WHERE
                        Application_ID = '${application_id}'

                `; postResults(query);

            } else {
                var query = `

                    INSERT INTO
                        project_application

                    VALUES (
                        '',
                        '${student_id}',
                        '${project_id}',
                        '${preference}',
                        '${date}'

                )`; postResults(query);
            };

        }); refreshPage();
    });

    $("#assignment-button-minimize").click(function() {
        optimizeProjects("minimize");
    });

    $("#assignment-button-maximize").click(function() {
        optimizeProjects("maximize");
    });

    $("#assignment-button-assign").click(function() {
        assignStudents();
    });

    $("#assignment-button-update").click(function() {
        updateStudents();
    });

    $("#assignment-button-reset").click(function() {
        resetStudents();
    });

});

// ========================================
//      PAGE TEMPLATE RENDERING
// ========================================

function renderPreferenceSelect() {
    var query = `

        SELECT
            student.Student_ID,

            CONCAT_WS(" ",
                student.FirstName,
                student.LastName
            ) AS "Student"

        FROM
            student
    `;

    Promise.all([
        getResults(query),

    ]).then(function([query]) {
        var element = $("#preference-select");
        var template = "./templates/preference-select.htm";
        renderTemplate(query, template, element);
    });
};

function renderPreferenceTable(student_id) {
    var query = `

        SELECT
            project.Project_ID,
            project.Project_No,
            project.Title,
            project_application.Application_ID,
            project_application.Student_ID,
            project_application.Preference_Order

        FROM
            project
                LEFT JOIN project_application
                    ON project_application.Project_ID = project.Project_ID
                    AND project_application.Student_ID = ${student_id}

        ORDER BY
            project.Project_No
    `;

    Promise.all([
        getResults(query),

    ]).then(function([query]) {
        var element = $("#preference-table");
        var template = "./templates/preference-table.htm";
        renderTemplate(query, template, element).done(function() {

            query.forEach(function(application) {
                if (application.Preference_Order) {
                    var project_no = application.Project_No;
                    var preference = application.Preference_Order;
                    $(`#preference-td-radio-${project_no}-${preference}`).prop("checked", true);

                    var enabled = [
                        $("#preference-button-update"),
                    ]; enableElements(enabled);

                } else {
                    var enabled = [
                        $("#preference-button-apply"),
                    ]; enableElements(enabled);
                };

            });
        });
    });
};

function renderAssignmentPage() {
    var query = `

        SELECT
            project.Project_ID,
            project.Title,

            CONCAT_WS(" ",
                project_sponsor.FirstName,
                project_sponsor.LastName
            ) AS "Sponsor",

            CONCAT_WS(" ",
                instructor.FirstName,
                instructor.LastName
            ) AS "Instructor"

        FROM
            project
                LEFT JOIN instructor
                    ON instructor.Instructor_ID = project.Instructor_ID
                LEFT JOIN project_sponsor
                    ON project_sponsor.Sponsor_ID = project.Sponsor_ID
    `;

    Promise.all([
        getResults(query),
        getStudents(),
        getProjects(),
        getApplications(),
        getAssignments(),

    ]).then(function([query, students, projects, applications, assignments]) {
        element = $("#assignment-table");
        template = "./templates/assignment-table.htm";
        renderTemplate(query, template, element).done(function() {

            var weights = getProjectWeights(applications);
            $.each(weights, function(index, weight) {
                var element = $(`#assignment-td-${index}-weight`);
                element.html((Math.round(weight * 100) / 100).toFixed(2));
            });

            if (!assignments.length) {
                var enabled = [
                    $("#assignment-input-min"),
                    $("#assignment-input-max"),
                    $("#assignment-button-minimize"),
                    $("#assignment-button-maximize"),
                    $("#assignment-button-assign"),
                    $("#assignment-button-update"),
                    $("#assignment-button-reset"),
                ]; enableElements(enabled);

            } else  {
                var enabled = [
                    $("#assignment-button-update"),
                    $("#assignment-button-reset"),
                ]; enableElements(enabled);

                var project_list = []
                assignments.forEach(function(assignment, i) {
                    var project_id = assignment.Project_ID;
                    var student_id = assignment.Student_ID;

                    var data = {
                        Project_ID: `${project_id}`,
                        Student_ID: `${student_id}`,
                        Students: {},
                    };

                    data.Students = students.map(function(student) {
                        return student;
                    });

                    if (!(project_list.includes(project_id))) {
                        project_list.push(project_id);
                    };

                    renderAssignmentSelect(
                        data,
                        student_id,
                        project_id,
                    );
                });

            };
        });
    });
};

function renderAssignmentSelect(data, student_id, project_id) {
    var template = "./templates/assignment-select.htm";
    var element = $(`#assignment-td-${project_id}-students`);
    renderTemplate(data, template, element).done(function() {
        var element = $(`select#${student_id}`);
        element.val(student_id);
    });
};

// ========================================
//      JSON EVENTS
// ========================================

function getResults(query) {
    return $.ajax({
        cache: false,
        url: "./handler.php",
        method: "GET",
        data: {query: query},
        dataType: "JSON",
    }).fail(function(xhr, status, error) {
        console.log(xhr.responseText);
    });
};

function postResults(query) {
    return $.ajax({
        cache: false,
        url: "./handler.php",
        method: "POST",
        data: {query: query},
    }).fail(function(xhr, status, error) {
        console.log(xhr.responseText);
    });
};

function renderTemplate(data, template, element) {
    return $.get(template, function(template) {
        var html = Mustache.render(template, data);
        element.append(html);
    });
};

// ========================================
//      GETTERS
// ========================================

function getProject(project_id) {
    var query = `
        SELECT * FROM project WHERE
            project.Project_ID = ${project_id}
    `; return getResults(query);
};

function getProjects() {
    var query = `SELECT * FROM project`;
    return getResults(query);
};

function getApplication(application_id) {
    var query = `
        SELECT * FROM project_application WHERE
            project_application.Application_ID = ${application_id}
    `; return getResults(query);
};

function getApplications() {
    var query = `SELECT * FROM project_application`;
    return getResults(query);
};

function getAssignments() {
    var query = `SELECT * FROM project_assignment`;
    return getResults(query);
}

function getStudent(student_id) {
    var query = `
        SELECT * FROM student WHERE
            student.Student_ID = ${student_id}
    `; return getResults(query);
};

function getStudents() {
    var query = `SELECT * FROM student`;
    return getResults(query);
};

// ========================================
//      PROMPTS & ERROR HANDLING
// ========================================

function surplusProjectsConfirm() {
    return confirm(
        "There are additional projects available, but not enough students " +
        "to fill all projects member slots. These projects will remain in " +
        "the database. Please ensure that all priority projects contain a " +
        "astrisk \"*\" in the title. When ready, click \"ok\" to proceed."
    );
};

function deficitProjectsAlert() {
    return alert(
        "There are not enough projects to support the total amount of " +
        "students. Please add more projects, or adjust the minimum or " +
        "maximum students per project and try again."
    );
};

function missingApplicationsAlert() {
    return alert(
        "Some projects are missing applications. Please see the console " +
        "(F12) for a list of students that are missing applications."
    );
};

function duplicateStudentsAlert() {
    return alert(
        "There are student(s) with more than one project assignment. " +
        "A student can only be assigned to a single project."
    );
};

// ========================================
//      MISCELLANEOUS
// ========================================

function refreshPage() {
    setTimeout(function() {
        window.location.reload(true);
    }, 250);
};

function enableElements(elements) {
    elements.forEach(function(element, i) {
        element.attr("disabled", false);
    });
};

function disableElements(elements) {
    elements.forEach(function(element, i) {
        element.attr("disabled", true);
    });
};
