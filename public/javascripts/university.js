const app = angular.module('University', ['ngResource','ngRoute']);

app.config(['$routeProvider', ($routeProvider) => {
    $routeProvider
        .when('/', {templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'})
        
        .when('/add-student', {templateUrl: 'partials/student-form.html',
        controller: 'AddStudentCtrl'})
        
        .when('/add-department', {templateUrl: './partials/faculty-form.html',
        controller: 'AddDepartmentCtrl'})
        
        .when('/add-subject', {templateUrl: './partials/subject-form.html',
        controller: 'AddSubjectCtrl'})

        .when('/add-lecturer', {templateUrl: './partials/lecturer-form.html',
        controller: 'AddLecturerCtrl'})

        .when('/add-exam-result', {templateUrl: './partials/exam-form.html',
        controller: 'AddExamCtrl'})

        .when('/student/:id', {templateUrl: 'partials/student-form.html',
        controller: 'EditStudentCtrl'})
        
        .when('/department/:id', {templateUrl: 'partials/faculty-form.html', 
        controller: 'EditDepartmentCtrl'})

        .when('/subject/:id', {templateUrl: 'partials/subject-form.html', 
        controller: 'EditSubjectCtrl'})

        .when('/lecturer/:id', {templateUrl: 'partials/lecturer-form.html', 
        controller: 'EditLecturerCtrl'})

        .when('/exam-result/:id', {templateUrl: 'partials/exam-form.html', 
        controller: 'EditExamCtrl'})


        .otherwise({redirectTo: '/'});
}]);

app.controller('HomeCtrl', ['$scope', '$resource', 
($scope, $resource) => {
    const Students = $resource('/api/students');
    const Faculties = $resource('/api/departments');
    const Subjects = $resource('/api/subjects');
    const Lecturers = $resource('/api/lecturers');
    const Exams = $resource('/api/exam-results');

    Students.query(students => $scope.students = students);
    Faculties.query(departments => $scope.departments = departments);
    Subjects.query(subjects => $scope.subjects = subjects);
    Lecturers.query(lecturers => $scope.lecturers = lecturers)
    Exams.query(exams => {
        $scope.examresults = exams;
        $scope.examresults.map(exam => {

            exam.student = ($scope.students.filter(student => student._id==exam.student))[0];
            exam.lecturer = ($scope.lecturers.filter(lecturer => lecturer._id==exam.lecturer))[0];
            exam.subject = ($scope.subjects.filter(subject => subject._id==exam.subject))[0];
        })
    })
}]);

app.controller('AddStudentCtrl', ['$scope', '$resource', '$location', 
($scope, $resource, $location) => {
    const Faculties = $resource('/api/departments');
    Faculties.query(departments => $scope.departments = departments);
    $scope.visible=false;
    $scope.save = () => {
        const Students = $resource('/api/students');
        $scope.student.department = $scope.student.department._id;
        $scope.student.speciality = $scope.student.speciality._id;
        Students.save($scope.student, () => $location.path('/'));
        console.log($scope.student);
    };
}]);

app.controller('EditStudentCtrl', ['$scope', '$resource', '$location', '$routeParams',
($scope, $resource, $location, $routeParams) => {
    const Students = $resource('api/students/:id', { id: '@_id' }, {
        update: { method: 'PUT' }
    });
    const Departments = $resource('/api/departments');
    Students.get({ id: $routeParams.id }, student => {
        console.log(student);
        student.birthdate = new Date(student.birthdate);
        $scope.student = student;
    });
    Departments.query(departments => {
        $scope.departments = departments;
        $scope.student.department = (departments.filter(department => department._id == $scope.student.department));
        $scope.student.department = $scope.student.department[0];
        $scope.student.speciality = $scope.student.department.specialities.filter(speciality => speciality._id == $scope.student.speciality);
        $scope.student.speciality = $scope.student.speciality[0];
    })


    
    $scope.visible = true;
    $scope.save = () => Students.update($scope.student, () => $location.path('/'));
    $scope.delete = () => Students.delete({ id : $routeParams.id }, () => $location.path('/'));
}]);

app.controller('AddDepartmentCtrl', ['$scope', '$resource', '$location', 
($scope, $resource, $location) => {
    $scope.visible=false;
    $scope.department = {name: "", specialities: []}
    $scope.department.specialities.push({_id: null, name :''});
    $scope.save = () => {
        const Departments = $resource('/api/departments');
        Departments.save($scope.department, () => $location.path('/'));
    };
    $scope.saves = (speciality) => {
        if(speciality.name.length > 0)
            $scope.department.specialities.push({name: ""});
    };
    $scope.deletes = (index) => {$scope.department.specialities.splice(index, 1);};
}]);

app.controller('EditDepartmentCtrl', ['$scope', '$resource', '$location', '$routeParams','$compile',
($scope, $resource, $location, $routeParams) => {
    const Departments = $resource('api/departments/:id', { id: '@_id' }, {
        update: { method: 'PUT' }
    });
    Departments.get({ id: $routeParams.id }, department => { 
        $scope.department = department;
    });
    $scope.visible = true;
    $scope.save = () => Departments.update($scope.department, () => $location.path('/'));
    $scope.delete = () => Departments.delete({ id : $routeParams.id }, () => $location.path('/'));
    $scope.saves = (speciality) => {
        if(speciality.name.length>0)
            $scope.department.specialities.push({name: ""});
    };
    $scope.deletes = (index) => {$scope.department.specialities.splice(index, 1);};

}]);

app.controller('AddSubjectCtrl', ['$scope', '$resource', '$location', 
($scope, $resource, $location) => {
    $scope.visible=false;
    $scope.save = () => {
        const Subjects = $resource('/api/subjects');
        Subjects.save($scope.subject, () => $location.path('/'));
    };
}]);

app.controller('EditSubjectCtrl', ['$scope', '$resource', '$location', '$routeParams',
($scope, $resource, $location, $routeParams) => {
    const Subjects = $resource('api/subjects/:id', { id: '@_id' }, {
        update: { method: 'PUT' }
    });
    Subjects.get({ id: $routeParams.id }, subject => $scope.subject = subject);
    $scope.visible = true;
    $scope.save = () => Subjects.update($scope.subject, () => $location.path('/'));
    $scope.delete = () => Subjects.delete({ id : $routeParams.id }, () => $location.path('/'));
}]);

app.controller('AddLecturerCtrl', ['$scope', '$resource', '$location', 
($scope, $resource, $location) => {
    const Subjects = $resource('/api/subjects');
    Subjects.query(subjects => $scope.subjects = subjects);
    $scope.visible=false;
    $scope.save = () => {
        const Lecturers = $resource('/api/lecturers');
        var subjects = new Array();
        $scope.lecturer.subjects.map(subject => subjects.push(subject._id));
        $scope.lecturer.subjects = subjects;
        console.log($scope.lecturer.subjects);
        Lecturers.save($scope.lecturer, () => $location.path('/'));
        
    };
}]);

app.controller('EditLecturerCtrl', ['$scope', '$resource', '$location', '$routeParams',
($scope, $resource, $location, $routeParams) => {
    const Lecturers = $resource('api/lecturers/:id', { id: '@_id' }, {
        update: { method: 'PUT' }
    });
    const Subjects = $resource('/api/subjects');
    Lecturers.get({ id: $routeParams.id }, lecturer => $scope.lecturer = lecturer);
    Subjects.query(subjects => {
        $scope.subjects = subjects;
        var lectSubjects = new Array();
        $scope.lecturer.subjects.map(subject => {
            var my = new Array();
            my = subjects.filter(subject1 => subject1._id == subject);
            lectSubjects.push(my[0]);
        })
        $scope.lecturer.subjects = lectSubjects;
    })
    
    $scope.visible = true;
    $scope.save = () => Lecturers.update($scope.lecturer, () => $location.path('/'));
    $scope.delete = () => Lecturers.delete({ id : $routeParams.id }, () => $location.path('/'));
}]);

app.controller('EditExamCtrl', ['$scope', '$resource', '$location', '$routeParams',
($scope, $resource, $location, $routeParams) => {
    const Exams = $resource('api/exam-results/:id', { id: '@_id' }, {
        update: { method: 'PUT' }
    });
    const Students = $resource('/api/students');
    Students.query(students => $scope.students = students);

    const Lecturers = $resource('/api/lecturers');
    const Subjects = $resource('/api/subjects/:id', {id: '@_id'});
    Lecturers.query(lecturers => {
        $scope.lecturers = lecturers;
        $scope.lecturers.map(lecturer => {
            var subjects = new Array();
            lecturer.subjects.map(subject => Subjects.get({id: subject}, object => subjects.push(object)));
            lecturer.subjects=subjects;
            //console.log(subjects);
        });
    });
    var main = {student: null, lecturer: null, mark: 0, subject: null};
    Exams.get({id: $routeParams.id}, exam => {
        main = exam;
        main.lecturer = $scope.lecturers.find(lecturer => lecturer._id==exam.lecturer);
        
        main.student = $scope.students.find(student => student._id==exam.student);
        
        main.mark = exam.mark;
        console.log(main.lecturer.subjects[0]);
        main.subject = main.lecturer.subjects.find(subject => subject._id==exam.subject);
    });
    
    window.setInterval(() => $scope.exam=main, 10);
    console.log(main);
    
    $scope.visible = true;
    $scope.save = () => Exams.update($scope.exam, () => $location.path('/'));
    $scope.delete = () => Exams.delete({ id : $routeParams.id }, () => $location.path('/'));
}]);

app.controller('AddExamCtrl', ['$scope', '$resource', '$location', 
($scope, $resource, $location) => {
    const Students = $resource('/api/students');
    Students.query(students => $scope.students = students);

    const Lecturers = $resource('/api/lecturers');
    const Subjects = $resource('/api/subjects/:id', {id: '@_id'});
    Lecturers.query(lecturers => {
        $scope.lecturers = lecturers;
        $scope.lecturers.map(lecturer => {
            var subjects = new Array();
            lecturer.subjects.map(subject => Subjects.get({id: subject}, object => subjects.push(object)));
            lecturer.subjects=subjects;
            //console.log(subjects);
        });
    });
    $scope.visible=false;
    $scope.save = () => {
        const Exams = $resource('/api/exam-results');
        $scope.exam.student = $scope.exam.student._id;
        $scope.exam.lecturer = $scope.exam.lecturer._id;
        $scope.exam.subject = $scope.exam.subject._id;
        Exams.save($scope.exam, () => $location.path('/'));
        //console.log($scope.exam);
    };
}]);

app.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick;
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
}])
app.directive('specialitiBuildForm', ['$compile',  
    function($compile) {
        return {
            restrict: 'E',
            link: function(scope, element, attr) {
                element.bind('click', (event) => {
                    element.after('<div clas="form-group"> <label>Speciality</label><input type="text" ng-model="' + attr.specialityBuildForm + 
                '" class="form-control"><input type="button" class="btn btn-primary" value="Save" ng-click="saveSpeciality()"/>' +
                '<button ng-show="visible" confirmed-click="deleteSpeciality()"'+ 
                'ng-confirm-click="Do you really want to delete?"  class="btn btn-danger">Delete</button></div>');
                $compile(element.parent())(scope)});
            }
        }
    }]);

