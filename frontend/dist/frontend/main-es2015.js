(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./$$_lazy_route_resource lazy recursive":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/analyze/analyze.component.ts":
/*!**********************************************!*\
  !*** ./src/app/analyze/analyze.component.ts ***!
  \**********************************************/
/*! exports provided: AnalyzeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnalyzeComponent", function() { return AnalyzeComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/__ivy_ngcc__/fesm2015/animations.js");
/* harmony import */ var _services_http_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/http.service */ "./src/app/services/http.service.ts");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/list */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/list.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/divider */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/checkbox */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/checkbox.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/form-field.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/select.js");
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/core */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _code_code_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../code/code.component */ "./src/app/code/code.component.ts");


















class AnalyzeComponent {
    constructor(http, data, snackbar) {
        this.http = http;
        this.data = data;
        this.snackbar = snackbar;
        this.isExpert = false;
        this.formatOptions = ["OpenQASM", "Quil", "Qiskit", "Pyquil"];
        this.depth = {
            "q_depth": 0,
            "q_gate_times": 0,
            "q_two_qubit": 0,
            "r_depth": 0,
            "r_gate_times": 0,
            "r_two_qubit": 0
        };
    }
    ngOnInit() {
    }
    analyse() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            let object = {
                "circuit": this.data.getCircuit("internal")
            };
            let counts = yield this.http.callBackend(object, "depth");
            let depthObject = JSON.parse(counts);
            if (depthObject) {
                this.depth = depthObject;
            }
        });
    }
    useQiskit() {
        this.architecture = "IBMQ";
        this.selectedFormatOption = "OpenQASM";
        this.unroll();
        if (!this.isExpert) {
            this.formatUsed = "qasm";
        }
    }
    useRigetti() {
        this.architecture = "Rigetti";
        this.selectedFormatOption = "Quil";
        this.unroll();
        if (!this.isExpert) {
            this.formatUsed = "quil";
        }
    }
    unroll() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (this.isExpert) {
                if (!(this.formatOptions.includes(this.selectedFormatOption))) {
                    this.snackbar.open("You must choose an output language/framework or disable expert mode.");
                    return;
                }
            }
            this.snackbar.open("Request sent to backend. Results will be available shortly.");
            let object = {
                "option": this.architecture,
                "circuit": this.data.circuits["internal"],
                "isExpert": this.isExpert,
                "format": this.selectedFormatOption,
            };
            let circuit = yield this.http.callBackend(object, "unroll");
            if (circuit) {
                this.data.setCircuit("export", circuit);
            }
        });
    }
    download() {
        if (this.data.circuits[2] === "") {
            this.snackbar.open("Circuit is empty.");
            return;
        }
        if (!this.formatUsed) {
            this.snackbar.open("No valid format specified.");
            return;
        }
        var blob = new Blob([this.data.circuits["export"]], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "circuit." + this.formatUsed);
    }
    changed(event) {
        this.selectedFormatOption = event.value;
        this.formatUsed = this.selectedFormatOption;
        if (this.architecture) {
            this.unroll();
        }
    }
}
AnalyzeComponent.ɵfac = function AnalyzeComponent_Factory(t) { return new (t || AnalyzeComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_http_service__WEBPACK_IMPORTED_MODULE_3__["HttpService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__["MatSnackBar"])); };
AnalyzeComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: AnalyzeComponent, selectors: [["app-analyze"]], decls: 69, vars: 8, consts: [[1, "tab-content"], [1, "pl-4", "matList"], ["mat-subheader", ""], [1, "row", "justify-content-center"], ["matTooltip", "Length of the longest path of the unrolled circuit for IBM QX.", 1, "col"], [1, "col"], ["matTooltip", "Counts the two qubits gates on the longest path of the unrolled circuit for IBM QX.", 1, "col"], ["matTooltip", "Counts the number of pulses of the unrolled circuit for IBM QX.", 1, "col"], ["mat-mini-fab", "", "color", "primary", 1, "col", 3, "click"], [1, "mt-2", "mb-2"], [1, "row"], ["matTooltip", "Length of the longest path of the unrolled circuit for Rigetti architectures..", 1, "col"], ["matTooltip", "Counts the two qubits gates on the longest path of the unrolled circuit for Rigetti architectures.", 1, "col"], ["matTooltip", "Counts the number of pulses of the unrolled circuit for Rigetti architectures.", 1, "col"], [1, "col", "float-left", "pl-5"], [1, "example-margin", 3, "ngModel", "ngModelChange"], [1, "col-4"], [1, "w-100"], [3, "selectionChange"], [1, "pl-2", "pt-2", "selectionTitle"], ["value", "OpenQASM"], ["value", "Quil"], ["value", "Qiskit"], ["matTooltip", "Pyquil program can be exported in the backend. The export of Pyquil skeleton code is experimential.", "matTooltipClass", "tooltip-large", "value", "Pyquil"], [1, "col", "float-right", "pr-5"], ["mat-mini-fab", "", "matTooltip", "Download Circuit.", "matTooltipClass", "tooltip-large", "color", "primary", 1, "float-right", 3, "click"], ["circuitRef", "export", 1, "pt-5", "row"]], template: function AnalyzeComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "mat-list", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Qiskit");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "Depth:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, " Two-Qubit Depth:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, "X90 Pulses Depth:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AnalyzeComponent_Template_button_click_18_listener() { return ctx.useQiskit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "keyboard_arrow_right");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "mat-divider", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "Rigetti");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, "Depth:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](28);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, " Two Qubit Depth:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](34, "X90 Pulses Depth:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](36);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](38, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AnalyzeComponent_Template_button_click_38_listener() { return ctx.useRigetti(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](39, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](40, "keyboard_arrow_right");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](41, "mat-divider", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](42, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](43, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](44, "mat-checkbox", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function AnalyzeComponent_Template_mat_checkbox_ngModelChange_44_listener($event) { return ctx.isExpert = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](45, "Expert Mode");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](47, "mat-form-field", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](48, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](49, " Choose Export Language/Framework");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](50, "mat-select", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("selectionChange", function AnalyzeComponent_Template_mat_select_selectionChange_50_listener($event) { return ctx.changed($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](51, "p", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](52, "Languages");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](53, "mat-option", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](54, " OpenQASM ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](55, "mat-option", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](56, " Quil ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](57, "mat-divider");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](58, "p", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](59, "Frameworks");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](60, "mat-option", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](61, " Qiskit ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](62, "mat-option", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](63, " Pyquil ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](64, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](65, "button", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AnalyzeComponent_Template_button_click_65_listener() { return ctx.download(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](66, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](67, "system_update");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](68, "app-code", 26);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.depth["q_depth"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.depth["q_two_qubit"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.depth["q_gate_times"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.depth["r_depth"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.depth["r_two_qubit"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.depth["r_gate_times"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.isExpert);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("@expert", ctx.isExpert ? "open" : "closed");
    } }, directives: [_angular_material_list__WEBPACK_IMPORTED_MODULE_6__["MatList"], _angular_material_list__WEBPACK_IMPORTED_MODULE_6__["MatListSubheaderCssMatStyler"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_7__["MatTooltip"], _angular_material_button__WEBPACK_IMPORTED_MODULE_8__["MatButton"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__["MatIcon"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_10__["MatDivider"], _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_11__["MatCheckbox"], _angular_forms__WEBPACK_IMPORTED_MODULE_12__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_12__["NgModel"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__["MatLabel"], _angular_material_select__WEBPACK_IMPORTED_MODULE_14__["MatSelect"], _angular_material_core__WEBPACK_IMPORTED_MODULE_15__["MatOption"], _code_code_component__WEBPACK_IMPORTED_MODULE_16__["CodeComponent"]], styles: [".matList[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.redoButton[_ngcontent-%COMP%] {\n  width: 100%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NlZWRyaXgvUHJvZ3JhbW1pbmcvUXVhbnR1bVRyYW5zcGlsZXIvZnJvbnRlbmQvc3JjL2FwcC9hbmFseXplL2FuYWx5emUuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL2FuYWx5emUvYW5hbHl6ZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLFdBQUE7QUNDSjs7QURFQTtFQUNJLFdBQUE7QUNDSiIsImZpbGUiOiJzcmMvYXBwL2FuYWx5emUvYW5hbHl6ZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5tYXRMaXN0IHtcbiAgICB3aWR0aDogMTAwJTtcbn1cblxuLnJlZG9CdXR0b24ge1xuICAgIHdpZHRoOiAxMDAlO1xufSIsIi5tYXRMaXN0IHtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi5yZWRvQnV0dG9uIHtcbiAgd2lkdGg6IDEwMCU7XG59Il19 */"], data: { animation: [
            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["trigger"])('expert', [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["state"])('open', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                    visibility: 'visible',
                    opacity: '1',
                    width: '*',
                })),
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["state"])('closed', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                    visibility: 'hidden',
                    width: "0px",
                    opacity: '0',
                })),
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])('open => closed', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])('0.5s')
                ]),
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])('closed => open', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])('0.5s')
                ]),
            ]),
        ] } });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AnalyzeComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-analyze',
                animations: [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["trigger"])('expert', [
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["state"])('open', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                            visibility: 'visible',
                            opacity: '1',
                            width: '*',
                        })),
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["state"])('closed', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                            visibility: 'hidden',
                            width: "0px",
                            opacity: '0',
                        })),
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])('open => closed', [
                            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])('0.5s')
                        ]),
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])('closed => open', [
                            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])('0.5s')
                        ]),
                    ]),
                ],
                templateUrl: './analyze.component.html',
                styleUrls: ['./analyze.component.scss']
            }]
    }], function () { return [{ type: _services_http_service__WEBPACK_IMPORTED_MODULE_3__["HttpService"] }, { type: _services_data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"] }, { type: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__["MatSnackBar"] }]; }, null); })();


/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _import_import_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./import/import.component */ "./src/app/import/import.component.ts");
/* harmony import */ var _circuit_circuit_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./circuit/circuit.component */ "./src/app/circuit/circuit.component.ts");
/* harmony import */ var _export_export_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./export/export.component */ "./src/app/export/export.component.ts");
/* harmony import */ var _convert_convert_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./convert/convert.component */ "./src/app/convert/convert.component.ts");
/* harmony import */ var _stepper_stepper_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./stepper/stepper.component */ "./src/app/stepper/stepper.component.ts");
/* harmony import */ var _analyze_analyze_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./analyze/analyze.component */ "./src/app/analyze/analyze.component.ts");










const routes = [
    { path: 'import', component: _import_import_component__WEBPACK_IMPORTED_MODULE_2__["ImportComponent"] },
    { path: 'circuit', component: _circuit_circuit_component__WEBPACK_IMPORTED_MODULE_3__["CircuitComponent"] },
    { path: 'export', component: _export_export_component__WEBPACK_IMPORTED_MODULE_4__["ExportComponent"] },
    { path: 'convert', component: _convert_convert_component__WEBPACK_IMPORTED_MODULE_5__["ConvertComponent"] },
    { path: 'stepper', component: _stepper_stepper_component__WEBPACK_IMPORTED_MODULE_6__["StepperComponent"] },
    { path: 'unroll', component: _analyze_analyze_component__WEBPACK_IMPORTED_MODULE_7__["AnalyzeComponent"] },
    // { path: 'unroll', component: UnrollComponent },
    { path: '**', redirectTo: '/stepper' },
];
class AppRoutingModule {
}
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
        _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/toolbar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/toolbar.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");






class AppComponent {
    constructor() {
        this.title = 'frontend';
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 17, vars: 2, consts: [["color", "primary"], [1, "spacer"], [1, "spacer-large"], ["mat-button", "", 3, "routerLink"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-toolbar", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "span", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Quantum Circuit Transpiler");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "view_carousel");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, " Transpiling and Analyzing ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "compare_arrows");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, " Circuit Conversion ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "span", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "router-outlet");
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", "/stepper");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", "/convert");
    } }, directives: [_angular_material_toolbar__WEBPACK_IMPORTED_MODULE_1__["MatToolbar"], _angular_material_button__WEBPACK_IMPORTED_MODULE_2__["MatAnchor"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterLinkWithHref"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__["MatIcon"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterOutlet"]], styles: [".spacer[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\n\n.spacer-large[_ngcontent-%COMP%] {\n  flex: 2 1 auto;\n}\n\na[_ngcontent-%COMP%] {\n  color: white;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: 20px;\n}\n\nmat-icon[_ngcontent-%COMP%] {\n  vertical-align: middle;\n  display: inline;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NlZWRyaXgvUHJvZ3JhbW1pbmcvUXVhbnR1bVRyYW5zcGlsZXIvZnJvbnRlbmQvc3JjL2FwcC9hcHAuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL2FwcC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQTtFQUNJLGNBQUE7QUNMSjs7QURRQTtFQUNJLGNBQUE7QUNMSjs7QURRQTtFQUNJLFlBQUE7RUFDQSxvQ0FBQTtFQUNBLGVBQUE7QUNMSjs7QURTQTtFQUNJLHNCQUFBO0VBQ0EsZUFBQTtBQ05KIiwiZmlsZSI6InNyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiJGRhcms6ICMzRjUxQjU7XG4vLyAkbGlnaHQ6ICM2ZWM2ZmY7XG4vLyAkZGFyazogIzAwNjljMDtcblxuLy8gJHZlcnlfbGlnaHQ6ICNmNmY5ZmU7XG5cbi5zcGFjZXIge1xuICAgIGZsZXg6IDEgMSBhdXRvO1xufVxuXG4uc3BhY2VyLWxhcmdlIHtcbiAgICBmbGV4OiAyIDEgYXV0bztcbn1cblxuYSAge1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBmb250LWZhbWlseTogJ09wZW4gU2FucycsIHNhbnMtc2VyaWY7XG4gICAgZm9udC1zaXplOiAyMHB4O1xufVxuXG5cbm1hdC1pY29uIHtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgIGRpc3BsYXk6IGlubGluZTtcbn0iLCIuc3BhY2VyIHtcbiAgZmxleDogMSAxIGF1dG87XG59XG5cbi5zcGFjZXItbGFyZ2Uge1xuICBmbGV4OiAyIDEgYXV0bztcbn1cblxuYSB7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgZm9udC1mYW1pbHk6IFwiT3BlbiBTYW5zXCIsIHNhbnMtc2VyaWY7XG4gIGZvbnQtc2l6ZTogMjBweDtcbn1cblxubWF0LWljb24ge1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICBkaXNwbGF5OiBpbmxpbmU7XG59Il19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-root',
                templateUrl: './app.component.html',
                styleUrls: ['./app.component.scss']
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/animations.js");
/* harmony import */ var _input_input_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./input/input.component */ "./src/app/input/input.component.ts");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/form-field.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/input.js");
/* harmony import */ var _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/autocomplete */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/autocomplete.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/select.js");
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/divider */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/toolbar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/toolbar.js");
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/tabs */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tabs.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");
/* harmony import */ var _code_code_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./code/code.component */ "./src/app/code/code.component.ts");
/* harmony import */ var ngx_monaco_editor__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ngx-monaco-editor */ "./node_modules/ngx-monaco-editor/__ivy_ngcc__/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _import_import_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./import/import.component */ "./src/app/import/import.component.ts");
/* harmony import */ var _export_export_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./export/export.component */ "./src/app/export/export.component.ts");
/* harmony import */ var _circuit_circuit_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./circuit/circuit.component */ "./src/app/circuit/circuit.component.ts");
/* harmony import */ var _convert_convert_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./convert/convert.component */ "./src/app/convert/convert.component.ts");
/* harmony import */ var _graphical_graphical_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./graphical/graphical.component */ "./src/app/graphical/graphical.component.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
/* harmony import */ var _angular_material_stepper__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/material/stepper */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/stepper.js");
/* harmony import */ var _stepper_stepper_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./stepper/stepper.component */ "./src/app/stepper/stepper.component.ts");
/* harmony import */ var _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @angular/cdk/drag-drop */ "./node_modules/@angular/cdk/__ivy_ngcc__/fesm2015/drag-drop.js");
/* harmony import */ var _output_output_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./output/output.component */ "./src/app/output/output.component.ts");
/* harmony import */ var _unroll_unroll_component__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./unroll/unroll.component */ "./src/app/unroll/unroll.component.ts");
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @angular/material/checkbox */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/checkbox.js");
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! angular-bootstrap-md */ "./node_modules/angular-bootstrap-md/__ivy_ngcc__/fesm2015/angular-bootstrap-md.js");
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! @angular/material/list */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/list.js");
/* harmony import */ var _tab_tab_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./tab/tab.component */ "./src/app/tab/tab.component.ts");
/* harmony import */ var _simulate_simulate_component__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./simulate/simulate.component */ "./src/app/simulate/simulate.component.ts");
/* harmony import */ var _analyze_analyze_component__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./analyze/analyze.component */ "./src/app/analyze/analyze.component.ts");
/* harmony import */ var _gate_edit_gate_edit_component__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./gate-edit/gate-edit.component */ "./src/app/gate-edit/gate-edit.component.ts");
/* harmony import */ var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! @angular/material/bottom-sheet */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/bottom-sheet.js");
/* harmony import */ var _bottom_sheet_bottom_sheet_component__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./bottom-sheet/bottom-sheet.component */ "./src/app/bottom-sheet/bottom-sheet.component.ts");











































const monacoConfig = {
    baseUrl: 'assets',
    defaultOptions: { scrollBeyondLastLine: false }
};
class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, providers: [
        { provide: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_25__["MAT_SNACK_BAR_DEFAULT_OPTIONS"], useValue: { duration: 2500 } }
    ], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"],
            _angular_material_button__WEBPACK_IMPORTED_MODULE_7__["MatButtonModule"],
            _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInputModule"],
            _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_9__["MatAutocompleteModule"],
            _angular_material_select__WEBPACK_IMPORTED_MODULE_10__["MatSelectModule"],
            _angular_material_divider__WEBPACK_IMPORTED_MODULE_11__["MatDividerModule"],
            _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_12__["MatToolbarModule"],
            _angular_material_tabs__WEBPACK_IMPORTED_MODULE_13__["MatTabsModule"],
            _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__["MatIconModule"],
            _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_15__["MatTooltipModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_18__["FormsModule"],
            ngx_monaco_editor__WEBPACK_IMPORTED_MODULE_17__["MonacoEditorModule"].forRoot(),
            _angular_common_http__WEBPACK_IMPORTED_MODULE_24__["HttpClientModule"],
            _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_25__["MatSnackBarModule"],
            _angular_material_stepper__WEBPACK_IMPORTED_MODULE_26__["MatStepperModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_18__["FormsModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_18__["ReactiveFormsModule"],
            _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_28__["DragDropModule"],
            _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_31__["MatCheckboxModule"],
            angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_32__["MDBBootstrapModule"].forRoot(),
            _angular_material_list__WEBPACK_IMPORTED_MODULE_33__["MatListModule"],
            _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_38__["MatBottomSheetModule"],
            _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__["MatFormFieldModule"],
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
        _input_input_component__WEBPACK_IMPORTED_MODULE_5__["InputComponent"],
        _code_code_component__WEBPACK_IMPORTED_MODULE_16__["CodeComponent"],
        _import_import_component__WEBPACK_IMPORTED_MODULE_19__["ImportComponent"],
        _export_export_component__WEBPACK_IMPORTED_MODULE_20__["ExportComponent"],
        _circuit_circuit_component__WEBPACK_IMPORTED_MODULE_21__["CircuitComponent"],
        _convert_convert_component__WEBPACK_IMPORTED_MODULE_22__["ConvertComponent"],
        _graphical_graphical_component__WEBPACK_IMPORTED_MODULE_23__["GraphicalComponent"],
        _stepper_stepper_component__WEBPACK_IMPORTED_MODULE_27__["StepperComponent"],
        _output_output_component__WEBPACK_IMPORTED_MODULE_29__["OutputComponent"],
        _unroll_unroll_component__WEBPACK_IMPORTED_MODULE_30__["UnrollComponent"],
        _tab_tab_component__WEBPACK_IMPORTED_MODULE_34__["TabComponent"],
        _simulate_simulate_component__WEBPACK_IMPORTED_MODULE_35__["SimulateComponent"],
        _analyze_analyze_component__WEBPACK_IMPORTED_MODULE_36__["AnalyzeComponent"],
        _gate_edit_gate_edit_component__WEBPACK_IMPORTED_MODULE_37__["GateEditComponent"],
        _bottom_sheet_bottom_sheet_component__WEBPACK_IMPORTED_MODULE_39__["BottomSheetComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
        _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"],
        _angular_material_button__WEBPACK_IMPORTED_MODULE_7__["MatButtonModule"],
        _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInputModule"],
        _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_9__["MatAutocompleteModule"],
        _angular_material_select__WEBPACK_IMPORTED_MODULE_10__["MatSelectModule"],
        _angular_material_divider__WEBPACK_IMPORTED_MODULE_11__["MatDividerModule"],
        _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_12__["MatToolbarModule"],
        _angular_material_tabs__WEBPACK_IMPORTED_MODULE_13__["MatTabsModule"],
        _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__["MatIconModule"],
        _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_15__["MatTooltipModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_18__["FormsModule"], ngx_monaco_editor__WEBPACK_IMPORTED_MODULE_17__["MonacoEditorModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_24__["HttpClientModule"],
        _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_25__["MatSnackBarModule"],
        _angular_material_stepper__WEBPACK_IMPORTED_MODULE_26__["MatStepperModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_18__["FormsModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_18__["ReactiveFormsModule"],
        _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_28__["DragDropModule"],
        _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_31__["MatCheckboxModule"], angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_32__["MDBRootModule"], _angular_material_list__WEBPACK_IMPORTED_MODULE_33__["MatListModule"],
        _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_38__["MatBottomSheetModule"],
        _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__["MatFormFieldModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                declarations: [
                    _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
                    _input_input_component__WEBPACK_IMPORTED_MODULE_5__["InputComponent"],
                    _code_code_component__WEBPACK_IMPORTED_MODULE_16__["CodeComponent"],
                    _import_import_component__WEBPACK_IMPORTED_MODULE_19__["ImportComponent"],
                    _export_export_component__WEBPACK_IMPORTED_MODULE_20__["ExportComponent"],
                    _circuit_circuit_component__WEBPACK_IMPORTED_MODULE_21__["CircuitComponent"],
                    _convert_convert_component__WEBPACK_IMPORTED_MODULE_22__["ConvertComponent"],
                    _graphical_graphical_component__WEBPACK_IMPORTED_MODULE_23__["GraphicalComponent"],
                    _stepper_stepper_component__WEBPACK_IMPORTED_MODULE_27__["StepperComponent"],
                    _output_output_component__WEBPACK_IMPORTED_MODULE_29__["OutputComponent"],
                    _unroll_unroll_component__WEBPACK_IMPORTED_MODULE_30__["UnrollComponent"],
                    _tab_tab_component__WEBPACK_IMPORTED_MODULE_34__["TabComponent"],
                    _simulate_simulate_component__WEBPACK_IMPORTED_MODULE_35__["SimulateComponent"],
                    _analyze_analyze_component__WEBPACK_IMPORTED_MODULE_36__["AnalyzeComponent"],
                    _gate_edit_gate_edit_component__WEBPACK_IMPORTED_MODULE_37__["GateEditComponent"],
                    _bottom_sheet_bottom_sheet_component__WEBPACK_IMPORTED_MODULE_39__["BottomSheetComponent"]
                ],
                imports: [
                    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                    _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
                    _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"],
                    _angular_material_button__WEBPACK_IMPORTED_MODULE_7__["MatButtonModule"],
                    _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInputModule"],
                    _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_9__["MatAutocompleteModule"],
                    _angular_material_select__WEBPACK_IMPORTED_MODULE_10__["MatSelectModule"],
                    _angular_material_divider__WEBPACK_IMPORTED_MODULE_11__["MatDividerModule"],
                    _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_12__["MatToolbarModule"],
                    _angular_material_tabs__WEBPACK_IMPORTED_MODULE_13__["MatTabsModule"],
                    _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__["MatIconModule"],
                    _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_15__["MatTooltipModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_18__["FormsModule"],
                    ngx_monaco_editor__WEBPACK_IMPORTED_MODULE_17__["MonacoEditorModule"].forRoot(),
                    _angular_common_http__WEBPACK_IMPORTED_MODULE_24__["HttpClientModule"],
                    _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_25__["MatSnackBarModule"],
                    _angular_material_stepper__WEBPACK_IMPORTED_MODULE_26__["MatStepperModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_18__["FormsModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_18__["ReactiveFormsModule"],
                    _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_28__["DragDropModule"],
                    _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_31__["MatCheckboxModule"],
                    angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_32__["MDBBootstrapModule"].forRoot(),
                    _angular_material_list__WEBPACK_IMPORTED_MODULE_33__["MatListModule"],
                    _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_38__["MatBottomSheetModule"],
                    _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__["MatFormFieldModule"],
                ],
                providers: [
                    { provide: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_25__["MAT_SNACK_BAR_DEFAULT_OPTIONS"], useValue: { duration: 2500 } }
                ],
                bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/bottom-sheet/bottom-sheet.component.ts":
/*!********************************************************!*\
  !*** ./src/app/bottom-sheet/bottom-sheet.component.ts ***!
  \********************************************************/
/*! exports provided: BottomSheetComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BottomSheetComponent", function() { return BottomSheetComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/bottom-sheet */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/bottom-sheet.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/list */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/list.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/core */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/form-field.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/input.js");












function BottomSheetComponent_span_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Qubits");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function BottomSheetComponent_mat_form_field_5_Template(rf, ctx) { if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-form-field", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "input", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function BottomSheetComponent_mat_form_field_5_Template_input_ngModelChange_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r9); const index_r7 = ctx.index; const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return (ctx_r8.qubits[index_r7] = $event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const index_r7 = ctx.index;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("placeholder", "Qubit ", index_r7, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("formControlName", index_r7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx_r1.qubits[index_r7]);
} }
function BottomSheetComponent_span_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Classical Bit");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function BottomSheetComponent_mat_form_field_9_Template(rf, ctx) { if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-form-field", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "input", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function BottomSheetComponent_mat_form_field_9_Template_input_ngModelChange_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r13); const index_r11 = ctx.index; const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return (ctx_r12.clbits[index_r11] = $event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const index_r11 = ctx.index;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("placeholder", "Classical Bit ", index_r11, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("formControlName", index_r11 + ctx_r3.qubits.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx_r3.clbits[index_r11]);
} }
function BottomSheetComponent_span_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Parameter");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function BottomSheetComponent_mat_form_field_13_Template(rf, ctx) { if (rf & 1) {
    const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-form-field", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "input", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function BottomSheetComponent_mat_form_field_13_Template_input_ngModelChange_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r17); const index_r15 = ctx.index; const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return (ctx_r16.params[index_r15] = $event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const index_r15 = ctx.index;
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("placeholder", "Parameter ", index_r15, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("formControlName", index_r15 + ctx_r5.qubits.length + ctx_r5.clbits.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx_r5.params[index_r15]);
} }
class BottomSheetComponent {
    constructor(_bottomSheetRef, data, fb) {
        this._bottomSheetRef = _bottomSheetRef;
        this.data = data;
        this.fb = fb;
        this.qubits = data.qubits;
        this.params = data.params;
        this.clbits = data.clbits;
        let validatorsObject = {};
        for (let i = 0; i < this.qubits.length + this.params.length + this.clbits.length; i++) {
            validatorsObject["" + i] = ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required];
        }
        this.form = fb.group(validatorsObject);
    }
    ngOnInit() {
    }
    isNumber(number) {
        if (number === "") {
            return false;
        }
        return !isNaN(number);
    }
    valuesSelected(event) {
        let data = {
            qubits: this.qubits,
            params: this.params,
            clbits: this.clbits
        };
        this._bottomSheetRef.dismiss(data);
        event.preventDefault();
    }
    trackByFn(item, id) {
        return item;
    }
}
BottomSheetComponent.ɵfac = function BottomSheetComponent_Factory(t) { return new (t || BottomSheetComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_1__["MatBottomSheetRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_1__["MAT_BOTTOM_SHEET_DATA"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"])); };
BottomSheetComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: BottomSheetComponent, selectors: [["app-bottom-sheet"]], decls: 16, vars: 11, consts: [[3, "formGroup"], ["mat-list-item", ""], ["mat-line", "", "mat-subheader", "", 4, "ngIf"], [1, "row"], ["class", "col", "appearance", "outline", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mat-raised-button", "", "color", "primary", 1, "w-100", 3, "disabled", "click"], ["mat-line", "", "mat-subheader", ""], ["appearance", "outline", 1, "col"], ["type", "number", "matInput", "", 3, "placeholder", "ngModel", "formControlName", "ngModelChange"]], template: function BottomSheetComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "form", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-nav-list");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, BottomSheetComponent_span_3_Template, 2, 0, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, BottomSheetComponent_mat_form_field_5_Template, 2, 3, "mat-form-field", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, BottomSheetComponent_span_7_Template, 2, 0, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, BottomSheetComponent_mat_form_field_9_Template, 2, 3, "mat-form-field", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, BottomSheetComponent_span_11_Template, 2, 0, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](13, BottomSheetComponent_mat_form_field_13_Template, 2, 3, "mat-form-field", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function BottomSheetComponent_Template_button_click_14_listener($event) { return ctx.valuesSelected($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Values selected.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.form);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.qubits.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.qubits)("ngForTrackBy", ctx.trackByFn);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.clbits.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.clbits)("ngForTrackBy", ctx.trackByFn);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.params.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.params)("ngForTrackBy", ctx.trackByFn);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !ctx.form.valid);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormGroupDirective"], _angular_material_list__WEBPACK_IMPORTED_MODULE_3__["MatNavList"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgForOf"], _angular_material_button__WEBPACK_IMPORTED_MODULE_5__["MatButton"], _angular_material_core__WEBPACK_IMPORTED_MODULE_6__["MatLine"], _angular_material_list__WEBPACK_IMPORTED_MODULE_3__["MatListSubheaderCssMatStyler"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatFormField"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NumberValueAccessor"], _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInput"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControlName"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2JvdHRvbS1zaGVldC9ib3R0b20tc2hlZXQuY29tcG9uZW50LnNjc3MifQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](BottomSheetComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-bottom-sheet',
                templateUrl: './bottom-sheet.component.html',
                styleUrls: ['./bottom-sheet.component.scss']
            }]
    }], function () { return [{ type: _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_1__["MatBottomSheetRef"] }, { type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: [_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_1__["MAT_BOTTOM_SHEET_DATA"]]
            }] }, { type: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"] }]; }, null); })();


/***/ }),

/***/ "./src/app/circuit/circuit.component.ts":
/*!**********************************************!*\
  !*** ./src/app/circuit/circuit.component.ts ***!
  \**********************************************/
/*! exports provided: CircuitComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CircuitComponent", function() { return CircuitComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _code_code_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../code/code.component */ "./src/app/code/code.component.ts");
/* harmony import */ var _tab_tab_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tab/tab.component */ "./src/app/tab/tab.component.ts");




class CircuitComponent {
    constructor() { }
    ngOnInit() {
    }
}
CircuitComponent.ɵfac = function CircuitComponent_Factory(t) { return new (t || CircuitComponent)(); };
CircuitComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: CircuitComponent, selectors: [["app-circuit"]], decls: 6, vars: 0, consts: [[1, "container-fluid"], [1, "row"], [1, "col-3"], ["circuitRef", "internal"], [1, "col-9"]], template: function CircuitComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "app-code", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "app-tab");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_code_code_component__WEBPACK_IMPORTED_MODULE_1__["CodeComponent"], _tab_tab_component__WEBPACK_IMPORTED_MODULE_2__["TabComponent"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NpcmN1aXQvY2lyY3VpdC5jb21wb25lbnQuc2NzcyJ9 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](CircuitComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-circuit',
                templateUrl: './circuit.component.html',
                styleUrls: ['./circuit.component.scss']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "./src/app/code/code.component.ts":
/*!****************************************!*\
  !*** ./src/app/code/code.component.ts ***!
  \****************************************/
/*! exports provided: CodeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CodeComponent", function() { return CodeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var ngx_monaco_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-monaco-editor */ "./node_modules/ngx-monaco-editor/__ivy_ngcc__/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");





class CodeComponent {
    constructor(data) {
        this.data = data;
        this.decorations = [];
        this.editorOptions = {
            theme: 'vs-light', language: 'python', automaticLayout: true, scrollbar: {
                useShadows: false,
                verticalHasArrows: true,
                horizontalHasArrows: true,
                vertical: 'hidden',
                horizontal: 'hidden',
                verticalScrollbarSize: 0,
                horizontalScrollbarSize: 17,
                arrowSize: 30
            },
        };
    }
    ;
    ngOnInit() {
    }
    onInit(editor) {
        this.editor = editor;
        if (this.circuitRef === "internal") {
            this.data.highlightLines.subscribe((lines) => {
                if (lines.length > 0) {
                    let firstLine = lines[0];
                    let lastLine = lines[lines.length - 1];
                    this.markLine(firstLine, lastLine);
                }
            });
        }
    }
    ngAfterViewInit() {
    }
    onChange(circuit) {
        this.data.setCircuitOnWrite(this.circuitRef, circuit);
    }
    markLine(startLine, endLine) {
        this.decorations = this.editor.deltaDecorations(this.decorations, [
            { range: new monaco.Range(startLine, 1, endLine, 1), options: { isWholeLine: true, linesDecorationsClassName: 'myLineDecoration' } },
        ]);
        this.editor.revealLine(startLine);
    }
}
CodeComponent.ɵfac = function CodeComponent_Factory(t) { return new (t || CodeComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"])); };
CodeComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: CodeComponent, selectors: [["app-code"]], inputs: { circuitRef: "circuitRef" }, decls: 2, vars: 2, consts: [[1, "pt-2", 2, "height", "auto", "width", "100%"], [2, "height", "650px", 3, "options", "ngModel", "ngModelChange", "onInit"]], template: function CodeComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "ngx-monaco-editor", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function CodeComponent_Template_ngx_monaco_editor_ngModelChange_1_listener($event) { return ctx.onChange($event); })("onInit", function CodeComponent_Template_ngx_monaco_editor_onInit_1_listener($event) { return ctx.onInit($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("options", ctx.editorOptions)("ngModel", ctx.data.getCircuit(ctx.circuitRef));
    } }, directives: [ngx_monaco_editor__WEBPACK_IMPORTED_MODULE_2__["EditorComponent"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgModel"]], styles: [".outerDiv[_ngcontent-%COMP%] {\n  width: 20%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NlZWRyaXgvUHJvZ3JhbW1pbmcvUXVhbnR1bVRyYW5zcGlsZXIvZnJvbnRlbmQvc3JjL2FwcC9jb2RlL2NvZGUuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL2NvZGUvY29kZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLFVBQUE7QUNDSiIsImZpbGUiOiJzcmMvYXBwL2NvZGUvY29kZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5vdXRlckRpdiB7XG4gICAgd2lkdGg6IDIwJVxufVxuXG4iLCIub3V0ZXJEaXYge1xuICB3aWR0aDogMjAlO1xufSJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](CodeComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-code',
                templateUrl: './code.component.html',
                styleUrls: ['./code.component.scss']
            }]
    }], function () { return [{ type: _services_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"] }]; }, { circuitRef: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "./src/app/convert/convert.component.ts":
/*!**********************************************!*\
  !*** ./src/app/convert/convert.component.ts ***!
  \**********************************************/
/*! exports provided: ConvertComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConvertComponent", function() { return ConvertComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _input_input_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../input/input.component */ "./src/app/input/input.component.ts");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/form-field.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/select.js");
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/core */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/divider */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
/* harmony import */ var _output_output_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../output/output.component */ "./src/app/output/output.component.ts");














class ConvertComponent {
    constructor(data) {
        this.data = data;
        this.options = ["OpenQASM", "Quil", "Qiskit", "Pyquil"];
    }
    ngOnInit() {
    }
    computeInternal() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.child.computeInternal();
        });
    }
}
ConvertComponent.ɵfac = function ConvertComponent_Factory(t) { return new (t || ConvertComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"])); };
ConvertComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: ConvertComponent, selectors: [["app-convert"]], viewQuery: function ConvertComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵviewQuery"](_input_input_component__WEBPACK_IMPORTED_MODULE_2__["InputComponent"], true);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵloadQuery"]()) && (ctx.child = _t.first);
    } }, decls: 49, vars: 0, consts: [[1, "container", "pt-2"], [1, "row", "pt-2"], [1, "col"], [1, "w-100"], [3, "selectionChange"], [1, "pl-2", "pt-2"], ["value", "OpenQASM"], ["value", "Quil"], ["matTooltip", "Name of the circuit must be qc. All occurences can be changed with CTRL + F2.", "matTooltipClass", "tooltip-large", "value", "Qiskit"], ["matTooltip", "Name of the program must be p. All occurences can be changed with CTRL + F2.", "matTooltipClass", "tooltip-large", "value", "Pyquil"], [1, "col", "text-center"], ["mat-mini-fab", "", "matTooltip", "Convert Circuit.", "matTooltipClass", "tooltip-large", "color", "primary", 3, "click"], ["matTooltipClass", "tooltip-large", "value", "Qiskit"], ["matTooltip", "Pyquil program can be exported in the backend. The export of Pyquil skeleton code is experimential.", "matTooltipClass", "tooltip-large", "value", "Pyquil"], [1, "container-fluid", "pt-2"], [1, "row"], [1, "col", "content-left"], ["compute", "convert"]], template: function ConvertComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "mat-form-field", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, " Choose Input");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "mat-select", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("selectionChange", function ConvertComponent_Template_mat_select_selectionChange_6_listener($event) { return ctx.data.changedInput($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Languages");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "mat-option", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, " OpenQASM ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "mat-option", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, " Quil ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](13, "mat-divider");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Frameworks");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "mat-option", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, " Qiskit ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "mat-option", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, " Pyquil ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "button", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ConvertComponent_Template_button_click_21_listener() { return ctx.computeInternal(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "forward");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "mat-form-field", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](27, " Choose Output");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "mat-select", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("selectionChange", function ConvertComponent_Template_mat_select_selectionChange_28_listener($event) { return ctx.data.changedExport($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, "Languages");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "mat-option", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, " OpenQASM ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "mat-option", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](34, " Quil ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](35, "mat-divider");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](36, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](37, "Frameworks");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](38, "mat-option", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](39, " Qiskit ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](40, "mat-option", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](41, " Pyquil ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](42, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](43, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](44, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](45, "app-input", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](47, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](48, "app-output");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } }, directives: [_angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__["MatLabel"], _angular_material_select__WEBPACK_IMPORTED_MODULE_5__["MatSelect"], _angular_material_core__WEBPACK_IMPORTED_MODULE_6__["MatOption"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_7__["MatDivider"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__["MatTooltip"], _angular_material_button__WEBPACK_IMPORTED_MODULE_9__["MatButton"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_10__["MatIcon"], _input_input_component__WEBPACK_IMPORTED_MODULE_2__["InputComponent"], _output_output_component__WEBPACK_IMPORTED_MODULE_11__["OutputComponent"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbnZlcnQvY29udmVydC5jb21wb25lbnQuc2NzcyJ9 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](ConvertComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-convert',
                templateUrl: './convert.component.html',
                styleUrls: ['./convert.component.scss']
            }]
    }], function () { return [{ type: _services_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"] }]; }, { child: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"],
            args: [_input_input_component__WEBPACK_IMPORTED_MODULE_2__["InputComponent"]]
        }] }); })();


/***/ }),

/***/ "./src/app/export/export.component.ts":
/*!********************************************!*\
  !*** ./src/app/export/export.component.ts ***!
  \********************************************/
/*! exports provided: ExportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExportComponent", function() { return ExportComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_http_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/http.service */ "./src/app/services/http.service.ts");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/form-field.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/select.js");
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/core */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/divider */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");
/* harmony import */ var _code_code_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../code/code.component */ "./src/app/code/code.component.ts");
/* harmony import */ var _output_output_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../output/output.component */ "./src/app/output/output.component.ts");















class ExportComponent {
    constructor(http, snackbar, data) {
        this.http = http;
        this.snackbar = snackbar;
        this.data = data;
        this.options = ["OpenQASM", "Quil", "Qiskit", "Pyquil"];
    }
    ngOnInit() {
    }
    changed(event) {
        console.log(event);
        this.selectedOption = event.value;
    }
    computeExport() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (!(this.options.includes(this.selectedOption))) {
                this.snackbar.open("You must choose an output language/framework.");
                return;
            }
            let object = {
                "option": this.selectedOption,
                "circuit": this.data.getCircuit("current")
            };
            let circuit = yield this.http.callBackend(object, "export_circuit");
            if (circuit) {
                this.data.setExportCircuit(circuit, this.selectedOption);
            }
        });
    }
}
ExportComponent.ɵfac = function ExportComponent_Factory(t) { return new (t || ExportComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_http_service__WEBPACK_IMPORTED_MODULE_2__["HttpService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__["MatSnackBar"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"])); };
ExportComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: ExportComponent, selectors: [["app-export"]], decls: 31, vars: 0, consts: [[1, "container", "pt-2"], [1, "row", "pt-2"], [1, "col"], [1, "col", "text-center"], ["mat-mini-fab", "", "matTooltip", "Export Circuit in the chosen format.", "matTooltipClass", "tooltip-large", "color", "primary", 3, "click"], [1, "col", "float-right"], [1, "w-100"], [3, "selectionChange"], [1, "pl-2", "pt-2", "selectionTitle"], ["value", "OpenQASM"], ["value", "Quil"], ["value", "Qiskit"], ["matTooltip", "Pyquil program can be exported in the backend. The export of Pyquil skeleton code is experimential.", "matTooltipClass", "tooltip-large", "value", "Pyquil"], [1, "container-fluid", "pt-2"], [1, "row"], [1, "col", "content-left"], ["circuitRef", "current"]], template: function ExportComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ExportComponent_Template_button_click_4_listener() { return ctx.computeExport(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "forward");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "mat-form-field", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, " Choose Export Language/Framework");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "mat-select", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("selectionChange", function ExportComponent_Template_mat_select_selectionChange_11_listener($event) { return ctx.changed($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "p", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Languages");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "mat-option", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, " OpenQASM ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "mat-option", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, " Quil ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](18, "mat-divider");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "p", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "Frameworks");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "mat-option", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, " Qiskit ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "mat-option", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, " Pyquil ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](28, "app-code", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](30, "app-output");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } }, directives: [_angular_material_button__WEBPACK_IMPORTED_MODULE_5__["MatButton"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_6__["MatTooltip"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__["MatIcon"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatLabel"], _angular_material_select__WEBPACK_IMPORTED_MODULE_9__["MatSelect"], _angular_material_core__WEBPACK_IMPORTED_MODULE_10__["MatOption"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_11__["MatDivider"], _code_code_component__WEBPACK_IMPORTED_MODULE_12__["CodeComponent"], _output_output_component__WEBPACK_IMPORTED_MODULE_13__["OutputComponent"]], styles: [".content-left {\n  border-right: 1px solid #3f51b5;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NlZWRyaXgvUHJvZ3JhbW1pbmcvUXVhbnR1bVRyYW5zcGlsZXIvZnJvbnRlbmQvc3JjL2FwcC9leHBvcnQvZXhwb3J0LmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9leHBvcnQvZXhwb3J0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBO0VBQ0ksK0JBQUE7QUNISiIsImZpbGUiOiJzcmMvYXBwL2V4cG9ydC9leHBvcnQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAuY2hvb3NlIHtcbi8vICAgICBwYWRkaW5nLWxlZnQ6IDEwMHB4O1xuLy8gfVxuXG4uY29udGVudC1sZWZ0IHtcbiAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjM2Y1MWI1O1xufVxuIiwiLmNvbnRlbnQtbGVmdCB7XG4gIGJvcmRlci1yaWdodDogMXB4IHNvbGlkICMzZjUxYjU7XG59Il19 */"], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](ExportComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-export',
                templateUrl: './export.component.html',
                styleUrls: ['./export.component.scss'],
                encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewEncapsulation"].None,
            }]
    }], function () { return [{ type: _services_http_service__WEBPACK_IMPORTED_MODULE_2__["HttpService"] }, { type: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__["MatSnackBar"] }, { type: _services_data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/gate-edit/gate-edit.component.ts":
/*!**************************************************!*\
  !*** ./src/app/gate-edit/gate-edit.component.ts ***!
  \**************************************************/
/*! exports provided: GateEditComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GateEditComponent", function() { return GateEditComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/list */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/list.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/input.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");








function GateEditComponent_div_6_input_1_Template(rf, ctx) { if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "input", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function GateEditComponent_div_6_input_1_Template_input_ngModelChange_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8); const index_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().index; const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return (ctx_r7.gate.qubits[index_r5] = $event); })("ngModelChange", function GateEditComponent_div_6_input_1_Template_input_ngModelChange_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8); const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r10.change(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const index_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().index;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx_r6.gate.qubits[index_r5]);
} }
function GateEditComponent_div_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, GateEditComponent_div_6_input_1_Template, 1, 1, "input", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const index_r5 = ctx.index;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", index_r5 < ctx_r0.gate.operation.numberOfCtrlBits);
} }
function GateEditComponent_div_10_input_1_Template(rf, ctx) { if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "input", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function GateEditComponent_div_10_input_1_Template_input_ngModelChange_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r16); const index_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().index; const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return (ctx_r15.gate.qubits[index_r13] = $event); })("ngModelChange", function GateEditComponent_div_10_input_1_Template_input_ngModelChange_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r16); const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r18.change(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const index_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().index;
    const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx_r14.gate.qubits[index_r13]);
} }
function GateEditComponent_div_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, GateEditComponent_div_10_input_1_Template, 1, 1, "input", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const index_r13 = ctx.index;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", index_r13 >= ctx_r1.gate.operation.numberOfCtrlBits);
} }
function GateEditComponent_div_14_Template(rf, ctx) { if (rf & 1) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "input", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function GateEditComponent_div_14_Template_input_ngModelChange_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r23); const index_r21 = ctx.index; const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return (ctx_r22.gate.clbits[index_r21] = $event); })("ngModelChange", function GateEditComponent_div_14_Template_input_ngModelChange_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r23); const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r24.change(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const index_r21 = ctx.index;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx_r2.gate.clbits[index_r21]);
} }
function GateEditComponent_div_18_Template(rf, ctx) { if (rf & 1) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "input", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function GateEditComponent_div_18_Template_input_ngModelChange_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r28); const index_r26 = ctx.index; const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return (ctx_r27.gate.parameter[index_r26] = $event); })("ngModelChange", function GateEditComponent_div_18_Template_input_ngModelChange_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r28); const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r29.change(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const index_r26 = ctx.index;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx_r3.gate.parameter[index_r26]);
} }
class GateEditComponent {
    constructor(data, snackbar) {
        this.data = data;
        this.snackbar = snackbar;
    }
    ngOnInit() {
    }
    change() {
        console.log(this.gate);
        this.data.editOperation(this.gate, this.gate.lineNumbersInCircuit);
    }
}
GateEditComponent.ɵfac = function GateEditComponent_Factory(t) { return new (t || GateEditComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"])); };
GateEditComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: GateEditComponent, selectors: [["app-gate-edit"]], inputs: { gate: "gate" }, decls: 19, vars: 5, consts: [[1, "pl-4", "row", "matList"], [1, "col-3"], ["mat-subheader", ""], ["class", "col", 4, "ngFor", "ngForOf"], [1, "col"], ["matInput", "", "type", "number", 3, "ngModel", "ngModelChange", 4, "ngIf"], ["matInput", "", "type", "number", 3, "ngModel", "ngModelChange"]], template: function GateEditComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Control Qubits");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, GateEditComponent_div_6_Template, 2, 1, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Target Qubits");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, GateEditComponent_div_10_Template, 2, 1, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Classical Bits");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](14, GateEditComponent_div_14_Template, 2, 1, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Parameter");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](18, GateEditComponent_div_18_Template, 2, 1, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", ctx.gate.operation.name, " Gate");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.gate.qubits);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.gate.qubits);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.gate.clbits);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.gate.parameter);
    } }, directives: [_angular_material_list__WEBPACK_IMPORTED_MODULE_3__["MatListSubheaderCssMatStyler"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgForOf"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], _angular_material_input__WEBPACK_IMPORTED_MODULE_5__["MatInput"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NumberValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgModel"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2dhdGUtZWRpdC9nYXRlLWVkaXQuY29tcG9uZW50LnNjc3MifQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](GateEditComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-gate-edit',
                templateUrl: './gate-edit.component.html',
                styleUrls: ['./gate-edit.component.scss']
            }]
    }], function () { return [{ type: _services_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"] }, { type: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"] }]; }, { gate: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "./src/app/graphical/graphical.component.ts":
/*!**************************************************!*\
  !*** ./src/app/graphical/graphical.component.ts ***!
  \**************************************************/
/*! exports provided: GraphicalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GraphicalComponent", function() { return GraphicalComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_Operation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/Operation */ "./src/app/services/Operation.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _services_Utility__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/Utility */ "./src/app/services/Utility.ts");
/* harmony import */ var _bottom_sheet_bottom_sheet_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../bottom-sheet/bottom-sheet.component */ "./src/app/bottom-sheet/bottom-sheet.component.ts");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _services_http_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/http.service */ "./src/app/services/http.service.ts");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
/* harmony import */ var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/bottom-sheet */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/bottom-sheet.js");
/* harmony import */ var _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/cdk/drag-drop */ "./node_modules/@angular/cdk/__ivy_ngcc__/fesm2015/drag-drop.js");
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/divider */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
/* harmony import */ var _gate_edit_gate_edit_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../gate-edit/gate-edit.component */ "./src/app/gate-edit/gate-edit.component.ts");

















function GraphicalComponent_div_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "p", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Put the item here to remove it from the quantum circuit.");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function GraphicalComponent_div_9_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r9 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate"]("id", item_r9.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", item_r9.name, " ");
} }
function GraphicalComponent_div_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, GraphicalComponent_div_9_div_1_Template, 3, 2, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r2.importantGatesList);
} }
function GraphicalComponent_div_12_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "div", 19);
} if (rf & 2) {
    const line_r10 = ctx.$implicit;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngStyle", ctx_r3.setStyle(line_r10));
} }
function GraphicalComponent_div_13_div_1_div_6_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r22 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("cdkDragStarted", function GraphicalComponent_div_13_div_1_div_6_div_1_Template_div_cdkDragStarted_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r22); const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](4); return ctx_r21.dragStarted(); })("cdkDragEnded", function GraphicalComponent_div_13_div_1_div_6_div_1_Template_div_cdkDragEnded_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r22); const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](4); return ctx_r23.dragEnded(); })("mouseenter", function GraphicalComponent_div_13_div_1_div_6_div_1_Template_div_mouseenter_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r22); const operationIndex_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit; const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3); return ctx_r24.onMouseEnter(operationIndex_r16); })("mouseleave", function GraphicalComponent_div_13_div_1_div_6_div_1_Template_div_mouseleave_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r22); const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](4); return ctx_r26.onMouseLeave(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "mat-icon", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function GraphicalComponent_div_13_div_1_div_6_div_1_Template_mat_icon_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r22); const operationIndex_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit; const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3); return ctx_r27.edit(operationIndex_r16); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "edit ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    const index_r17 = ctx_r30.index;
    const operationIndex_r16 = ctx_r30.$implicit;
    const qubitIndex_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2).index;
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate2"]("id", "", qubitIndex_r12, "-", index_r17, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate"]("matTooltip", ctx_r18.getTooltip(operationIndex_r16));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", operationIndex_r16.operation.name, " ");
} }
function GraphicalComponent_div_13_div_1_div_6_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "div", 30);
} }
function GraphicalComponent_div_13_div_1_div_6_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r32 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("cdkDragStarted", function GraphicalComponent_div_13_div_1_div_6_div_3_Template_div_cdkDragStarted_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r32); const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](4); return ctx_r31.dragStarted(); })("cdkDragEnded", function GraphicalComponent_div_13_div_1_div_6_div_3_Template_div_cdkDragEnded_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r32); const ctx_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](4); return ctx_r33.dragEnded(); })("mouseenter", function GraphicalComponent_div_13_div_1_div_6_div_3_Template_div_mouseenter_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r32); const operationIndex_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit; const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3); return ctx_r34.onMouseEnter(operationIndex_r16); })("mouseleave", function GraphicalComponent_div_13_div_1_div_6_div_3_Template_div_mouseleave_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r32); const ctx_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](4); return ctx_r36.onMouseLeave(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "mat-icon", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function GraphicalComponent_div_13_div_1_div_6_div_3_Template_mat_icon_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r32); const operationIndex_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit; const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3); return ctx_r37.edit(operationIndex_r16); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "edit ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    const index_r17 = ctx_r40.index;
    const operationIndex_r16 = ctx_r40.$implicit;
    const qubitIndex_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2).index;
    const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate2"]("id", "", qubitIndex_r12, "-", index_r17, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate"]("matTooltip", ctx_r20.getTooltip(operationIndex_r16));
} }
function GraphicalComponent_div_13_div_1_div_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, GraphicalComponent_div_13_div_1_div_6_div_1_Template, 4, 4, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, GraphicalComponent_div_13_div_1_div_6_div_2_Template, 1, 0, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, GraphicalComponent_div_13_div_1_div_6_div_3_Template, 4, 3, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const operationIndex_r16 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !operationIndex_r16.placeholder && !operationIndex_r16.control);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", operationIndex_r16.placeholder);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", operationIndex_r16.control);
} }
function GraphicalComponent_div_13_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r42 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 23, 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("cdkDropListDropped", function GraphicalComponent_div_13_div_1_Template_div_cdkDropListDropped_4_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r42); const ctx_r41 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2); return ctx_r41.drop($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, GraphicalComponent_div_13_div_1_div_6_Template, 4, 3, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    const qubit_r11 = ctx_r43.$implicit;
    const qubitIndex_r12 = ctx_r43.index;
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" |", qubit_r11, "> ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("id", qubit_r11)("cdkDropListData", ctx_r13.data.operationsAtBit[qubitIndex_r12]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r13.data.operationsAtBit[qubitIndex_r12]);
} }
function GraphicalComponent_div_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, GraphicalComponent_div_13_div_1_Template, 7, 4, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const qubitIndex_r12 = ctx.index;
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r4.data.operationsAtBit[qubitIndex_r12].length > 0);
} }
function GraphicalComponent_mat_divider_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-divider", 7);
} }
function GraphicalComponent_div_15_div_7_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r53 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("cdkDragStarted", function GraphicalComponent_div_15_div_7_div_1_Template_div_cdkDragStarted_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r53); const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3); return ctx_r52.dragStarted(); })("cdkDragEnded", function GraphicalComponent_div_15_div_7_div_1_Template_div_cdkDragEnded_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r53); const ctx_r54 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3); return ctx_r54.dragEnded(); })("mouseenter", function GraphicalComponent_div_15_div_7_div_1_Template_div_mouseenter_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r53); const operationIndex_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit; const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2); return ctx_r55.onMouseEnter(operationIndex_r48); })("mouseleave", function GraphicalComponent_div_15_div_7_div_1_Template_div_mouseleave_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r53); const ctx_r57 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3); return ctx_r57.onMouseLeave(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "mat-icon", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function GraphicalComponent_div_15_div_7_div_1_Template_mat_icon_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r53); const operationIndex_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit; const ctx_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2); return ctx_r58.edit(operationIndex_r48); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "edit ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r61 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    const index_r49 = ctx_r61.index;
    const operationIndex_r48 = ctx_r61.$implicit;
    const clbitIndex_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().index;
    const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate2"]("id", "", clbitIndex_r45 + ctx_r50.data.qubitNames.length, "-", index_r49, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate"]("matTooltip", ctx_r50.getTooltip(operationIndex_r48));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", operationIndex_r48.operation.name, " ");
} }
function GraphicalComponent_div_15_div_7_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "div", 30);
} }
function GraphicalComponent_div_15_div_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, GraphicalComponent_div_15_div_7_div_1_Template, 4, 4, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, GraphicalComponent_div_15_div_7_div_2_Template, 1, 0, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const operationIndex_r48 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !operationIndex_r48.placeholder && !operationIndex_r48.control);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", operationIndex_r48.placeholder && (!operationIndex_r48.placeholder && !operationIndex_r48.control));
} }
function GraphicalComponent_div_15_Template(rf, ctx) { if (rf & 1) {
    const _r63 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 23, 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("cdkDropListDropped", function GraphicalComponent_div_15_Template_div_cdkDropListDropped_5_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r63); const ctx_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r62.drop($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, GraphicalComponent_div_15_div_7_Template, 3, 2, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const clbit_r44 = ctx.$implicit;
    const clbitIndex_r45 = ctx.index;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", clbit_r44, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate"]("id", clbitIndex_r45 + ctx_r6.data.qubitNames.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("cdkDropListData", ctx_r6.data.operationsAtBit[clbitIndex_r45 + ctx_r6.data.qubitNames.length]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r6.data.operationsAtBit[clbitIndex_r45 + ctx_r6.data.qubitNames.length]);
} }
function GraphicalComponent_div_16_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "mat-divider", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "app-gate-edit", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("gate", ctx_r7.selectedGate);
} }
class GraphicalComponent {
    constructor(data, http, _elementRef, snackbar, document, cdRef, _bottomSheet) {
        this.data = data;
        this.http = http;
        this._elementRef = _elementRef;
        this.snackbar = snackbar;
        this.cdRef = cdRef;
        this._bottomSheet = _bottomSheet;
        this.importantGatesList = _services_Operation__WEBPACK_IMPORTED_MODULE_2__["importantGatesList"];
        this.lineList = [];
        this.isGateSelected = false;
        this.dragged = false;
    }
    ;
    ngOnInit() {
    }
    ngAfterViewInit() {
        this.data.circuitChanged.subscribe(value => {
            this.cdRef.detectChanges();
            if (value) {
                this.computeGateConnections();
            }
        });
    }
    drop(event) {
        console.log(event.container.id);
        // change position of gate    
        if (event.previousContainer === event.container) {
            if ((event.container.id === "gateList") || event.previousIndex == event.currentIndex) {
                return;
            }
            this.moveOperation(event);
            // remove gate
        }
        else if (event.container.id === "gateList") {
            let id = event.item.element.nativeElement.id;
            let indices = id.split("-");
            let qubitIndex = parseInt(indices[0]);
            let index = parseInt(indices[1]);
            this.data.removeOperationAtIndex(index, qubitIndex);
            // add new gate
        }
        else if (event.previousContainer.id === "gateList") {
            let qubitIndex = parseInt(event.container.id);
            let index = event.currentIndex;
            let operation = _services_Operation__WEBPACK_IMPORTED_MODULE_2__["gateMap"][event.item.element.nativeElement.id.toLowerCase()];
            if (operation.numberOfQubits > 1 || operation.numberOfParameter > 0 || operation.numberOfClbits > 0) {
                this.openBottomSheet(operation, qubitIndex, index);
            }
            else {
                let operationIndex = new _services_Operation__WEBPACK_IMPORTED_MODULE_2__["OperationIndex"](index, operation, [], [qubitIndex], [], [this.data.getLinesToInsert(index, qubitIndex)]);
                this.data.addOperationIndex(operationIndex);
            }
            // change qubitIndex and possibly index of gate
        }
        else {
            this.moveOperation(event);
        }
    }
    moveOperation(event) {
        let newQubitIndex = parseInt(event.container.id);
        let newIndex = event.currentIndex;
        let id = event.item.element.nativeElement.id;
        let indices = id.split("-");
        let qubitIndex = parseInt(indices[0]);
        let index = parseInt(indices[1]);
        let operationIndex = this.data.operationsAtBit[qubitIndex][index];
        let linesToRemove = null;
        // change index
        if (index != newIndex) {
            linesToRemove = operationIndex.lineNumbersInCircuit;
            operationIndex.lineNumbersInCircuit = [this.data.getLinesToInsertEvent(index, newIndex, newQubitIndex)];
        }
        // change qubit 
        for (let i = 0; i < operationIndex.qubits.length; i++) {
            if (operationIndex.qubits[i] == qubitIndex) {
                operationIndex.qubits[i] = newQubitIndex;
            }
        }
        // change clbit
        // subtract number of qubits to the get clbit references
        let clbitIndex = qubitIndex - this.data.qubitNames.length;
        let newClbitIndex = newQubitIndex - this.data.qubitNames.length;
        for (let i = 0; i < operationIndex.clbits.length; i++) {
            if ((operationIndex.clbits[i]) == clbitIndex) {
                operationIndex.clbits[i] = newClbitIndex;
            }
        }
        this.data.editOperation(operationIndex, linesToRemove);
    }
    openBottomSheet(operation, qubitIndex, index) {
        let qubits = [qubitIndex].concat(operation.generateList(operation.numberOfQubits - 1));
        let params = operation.generateList(operation.numberOfParameter);
        let clbits = operation.generateList(operation.numberOfClbits);
        const bottomSheetRef = this._bottomSheet.open(_bottom_sheet_bottom_sheet_component__WEBPACK_IMPORTED_MODULE_5__["BottomSheetComponent"], {
            data: { qubits: qubits, params: params, clbits: clbits },
        });
        bottomSheetRef.afterDismissed().subscribe((data) => {
            if (data) {
                let qubits = data.qubits;
                let params = data.params;
                let clbits = data.clbits;
                let operationIndex = new _services_Operation__WEBPACK_IMPORTED_MODULE_2__["OperationIndex"](index, operation, params, qubits, clbits, [this.data.getLinesToInsert(index, qubits[0])]);
                this.data.addOperationIndex(operationIndex);
            }
        });
    }
    getLineNumbersIncreasedByOne(operationIndex) {
        let lineNumbers = [];
        operationIndex.lineNumbersInCircuit.forEach(element => {
            lineNumbers.push(element + 1);
        });
        return lineNumbers;
    }
    getTooltip(operationIndex) {
        let lineNumbers = this.getLineNumbersIncreasedByOne(operationIndex);
        let tooltip = `Lines in code: ${this.getLineNumbersIncreasedByOne(operationIndex)}`;
        if (operationIndex.parameter.length > 0) {
            tooltip += `\nParameter: ${operationIndex.parameter}`;
        }
        return tooltip;
    }
    recomputeGateConnections(event) {
        this.computeGateConnections();
    }
    computeGateConnections() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            // hacky solution: without delay the new elements with their new coordinates might not be in the view
            yield Object(_services_Utility__WEBPACK_IMPORTED_MODULE_4__["delay"])(10);
            let lineList = [];
            let circuitElement = document.getElementById(`circuit`);
            if (circuitElement == null) {
                return;
            }
            let circuitLeft = circuitElement.getClientRects()[0].x;
            let circuitRight = circuitElement.getClientRects()[0].x + circuitElement.getClientRects()[0].width;
            this.data.operationsAtBit.forEach((operationsAtIndex, qubitIndex) => {
                for (let index = 0; index < operationsAtIndex.length; index++) {
                    let operation = operationsAtIndex[index];
                    let line = new _services_Utility__WEBPACK_IMPORTED_MODULE_4__["ConnectorAttributes"]();
                    // operationsAtIndex.forEach((operation: OperationIndex, index) => {
                    if (!operation.placeholder && !operation.control) {
                        if (operation.operation.numberOfQubits > 1) {
                            operation.qubits.forEach(qubit => {
                                let element = document.getElementById(`${qubit}-${index}`);
                                if (element == null) {
                                    return;
                                }
                                let rects = element.getClientRects()[0];
                                if (rects == null) {
                                    return;
                                }
                                let xLeft = rects.x;
                                let xRight = rects.x + rects.width;
                                let yTop = rects.y;
                                let yBot = rects.y + rects.height;
                                line.setYTop(yTop);
                                line.setYBot(yBot);
                                line.setYLeft(xLeft);
                                line.setXRight(xRight);
                            });
                        }
                        else if (operation.operation.numberOfClbits > 0) {
                            line.measure = true;
                            let element = document.getElementById(`${operation.qubits[0]}-${index}`);
                            let element2 = document.getElementById(`${operation.clbits[0] + this.data.qubitNames.length}-${index}`);
                            if (element == null || element2 == null) {
                                continue;
                            }
                            let rects = element.getClientRects()[0];
                            let rects2 = element2.getClientRects()[0];
                            if (rects == null || rects2 == null) {
                                continue;
                            }
                            line.setYTop(rects.y);
                            line.setYBot(rects2.y + rects2.height);
                            line.setYLeft(rects.x);
                            line.setXRight(rects.x + rects.width);
                        }
                        if (line.xLeft < circuitLeft) {
                            continue;
                        }
                        if (line.xRight > circuitRight) {
                            continue;
                        }
                        lineList.push(line);
                    }
                }
            });
            this.lineList = lineList;
            this.cdRef.detectChanges();
        });
    }
    setStyle(line) {
        let styles = {
            'top': line.yTop + "px",
            'left': line.xLeft + "px",
            "width": line.getWidth() + "px",
            "height": line.getHeight() + "px",
        };
        if (line.measure) {
            styles['background-image'] = "linear-gradient(to bottom right, #4b830d, #aee571)";
            styles['opacity'] = "15%";
        }
        else {
            styles['background-image'] = "linear-gradient(to bottom right, #005cb2, #6ab7ff)";
            styles['opacity'] = "25%";
        }
        return styles;
    }
    edit(operationIndex) {
        this.oldSelectedGate = operationIndex;
        this.showGate(operationIndex);
    }
    onMouseEnter(operationIndex) {
        //recompute gate connections because of new elements on site that can change the layout
        this.computeGateConnections();
        this.highlightLines(operationIndex);
        if (!this.oldSelectedGate) {
            this.showGate(operationIndex);
        }
    }
    showGate(operationIndex) {
        this.highlightLines(operationIndex);
        this.selectedGate = operationIndex;
        this.isGateSelected = true;
    }
    highlightLines(operationIndex) {
        this.data.highlightLines.next(this.getLineNumbersIncreasedByOne(operationIndex));
    }
    onMouseLeave() {
        if (this.oldSelectedGate) {
            this.showGate(this.oldSelectedGate);
        }
    }
    dragStarted() {
        this.dragged = true;
    }
    dragEnded() {
        this.dragged = false;
    }
}
GraphicalComponent.ɵfac = function GraphicalComponent_Factory(t) { return new (t || GraphicalComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_data_service__WEBPACK_IMPORTED_MODULE_6__["DataService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_http_service__WEBPACK_IMPORTED_MODULE_7__["HttpService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_8__["MatSnackBar"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_3__["DOCUMENT"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_9__["MatBottomSheet"])); };
GraphicalComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: GraphicalComponent, selectors: [["app-graphical"]], hostBindings: function GraphicalComponent_HostBindings(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("resize", function GraphicalComponent_resize_HostBindingHandler($event) { return ctx.recomputeGateConnections($event); }, false, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresolveWindow"])("scroll", function GraphicalComponent_scroll_HostBindingHandler($event) { return ctx.recomputeGateConnections($event); }, false, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresolveWindow"]);
    } }, decls: 17, vars: 8, consts: [["cdkDropListGroup", "", "cdkDropListOrientation", "horizontal", 1, "tab-content"], [1, "container-fluid"], [1, "row"], ["cdkDropListSortingDisabled", "", "id", "gateList", "cdkDropList", "", "cdkDropListOrientation", "horizontal", 3, "cdkDropListData", "cdkDropListDropped"], ["gateList", "cdkDropList"], ["class", "deleteBox text-center", 4, "ngIf"], ["class", "row align-items-center", 4, "ngIf"], [1, "w-100", "mb-3", "mt-3"], ["id", "circuit", 1, "circuit"], ["class", "connector", 3, "ngStyle", 4, "ngFor", "ngForOf"], [4, "ngFor", "ngForOf"], ["class", "w-100 mb-3 mt-3", 4, "ngIf"], [4, "ngIf"], [1, "deleteBox", "text-center"], [1, "deleteText"], [1, "row", "align-items-center"], ["class", "col-1 mb-2", 4, "ngFor", "ngForOf"], [1, "col-1", "mb-2"], ["cdkDrag", "", 1, "gate", 3, "id"], [1, "connector", 3, "ngStyle"], ["class", "row", 4, "ngIf"], [1, "custom-container"], [1, "qubitName"], ["cdkDropList", "", "cdkDropListOrientation", "horizontal", 1, "list", 3, "id", "cdkDropListData", "cdkDropListDropped"], ["class", "placeholder", 4, "ngFor", "ngForOf"], [1, "placeholder"], ["class", "box", "cdkDrag", "", 3, "id", "matTooltip", "cdkDragStarted", "cdkDragEnded", "mouseenter", "mouseleave", 4, "ngIf"], ["class", "box emptyBox", "cdkDrag", "", 4, "ngIf"], ["cdkDrag", "", 1, "box", 3, "id", "matTooltip", "cdkDragStarted", "cdkDragEnded", "mouseenter", "mouseleave"], ["color", "primary", 1, "editBox", 3, "click"], ["cdkDrag", "", 1, "box", "emptyBox"], [1, "controlBox"], ["clbitList", "cdkDropList"], [3, "gate"]], template: function GraphicalComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "Possible Gates");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 3, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("cdkDropListDropped", function GraphicalComponent_Template_div_cdkDropListDropped_6_listener($event) { return ctx.drop($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, GraphicalComponent_div_8_Template, 3, 0, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](9, GraphicalComponent_div_9_Template, 2, 1, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](10, "mat-divider", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](12, GraphicalComponent_div_12_Template, 1, 1, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](13, GraphicalComponent_div_13_Template, 2, 1, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](14, GraphicalComponent_mat_divider_14_Template, 1, 0, "mat-divider", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](15, GraphicalComponent_div_15_Template, 8, 4, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](16, GraphicalComponent_div_16_Template, 3, 1, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("cdkDropListData", ctx.importantGatesList);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.dragged);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.dragged);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.lineList);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.data.qubitNames);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.data.clbitNames.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.data.clbitNames);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.isGateSelected);
    } }, directives: [_angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_10__["CdkDropListGroup"], _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_10__["CdkDropList"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_11__["MatDivider"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgForOf"], _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_10__["CdkDrag"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgStyle"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_12__["MatTooltip"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_13__["MatIcon"], _gate_edit_gate_edit_component__WEBPACK_IMPORTED_MODULE_14__["GateEditComponent"]], styles: ["@import url(\"https://fonts.googleapis.com/css2?family=Ubuntu:wght@300&display=swap\");\n\nhtml[_ngcontent-%COMP%], body[_ngcontent-%COMP%] {\n  height: 100%;\n}\nbody[_ngcontent-%COMP%] {\n  margin: 0;\n  font-family: Roboto, \"Helvetica Neue\", sans-serif;\n}\n.tooltip-large[_ngcontent-%COMP%] {\n  font-size: 12px;\n}\n.content-left[_ngcontent-%COMP%] {\n  border-right: 1px solid #3f51b5;\n}\na[_ngcontent-%COMP%]:hover {\n  opacity: 80% !important;\n}\n.selectionTitle[_ngcontent-%COMP%] {\n  color: #444444;\n}\n.tab-content[_ngcontent-%COMP%] {\n  padding-top: 10px;\n}\n.mat-tooltip[_ngcontent-%COMP%] {\n  white-space: pre-line;\n}\nh1[_ngcontent-%COMP%], h2[_ngcontent-%COMP%], h3[_ngcontent-%COMP%], h4[_ngcontent-%COMP%], h5[_ngcontent-%COMP%], h6[_ngcontent-%COMP%] {\n  font-family: \"Ubuntu\", sans-serif;\n}\n.myLineDecoration[_ngcontent-%COMP%] {\n  background: lightblue;\n  width: 5px !important;\n  margin-left: 3px;\n}\n.deleteBox[_ngcontent-%COMP%] {\n  outline: 2px dashed red;\n  width: 100%;\n  height: 174px;\n  position: relative;\n}\n.deleteBox[_ngcontent-%COMP%]:hover {\n  background-color: lightgray;\n}\n.deleteText[_ngcontent-%COMP%] {\n  left: 50%;\n  top: 50%;\n  position: absolute;\n  transform: translate(-50%, -50%);\n  margin: 0;\n}\n.gate[_ngcontent-%COMP%] {\n  width: 50px;\n  height: 50px;\n  border: solid 1px #ccc;\n  border-radius: 4px;\n  text-align: center;\n  line-height: 50px;\n  z-index: 1;\n  background-color: white;\n  overflow: hidden;\n  display: block;\n  cursor: move;\n}\n.qubitName[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 15px;\n  left: 0px;\n  background-color: white;\n  z-index: 1;\n  padding-right: 5px;\n}\n.custom-container[_ngcontent-%COMP%] {\n  width: 95%;\n  display: inline-block;\n  position: relative;\n}\n.circuit[_ngcontent-%COMP%] {\n  overflow: auto;\n  overflow-y: hidden;\n}\n.list[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  background: white;\n  border-radius: 4px;\n  z-index: -1;\n  padding-left: 25px;\n}\n.custom-container[_ngcontent-%COMP%]:after {\n  position: absolute;\n  top: 25px;\n  height: 1px;\n  background: #002984;\n  content: \"\";\n  width: 100%;\n  z-index: 0;\n}\n.placeholder[_ngcontent-%COMP%] {\n  width: 60px;\n  height: 60px;\n  z-index: 1;\n}\n.box[_ngcontent-%COMP%] {\n  width: 50px;\n  height: 50px;\n  border: solid 1px #ccc;\n  border-radius: 4px;\n  text-align: center;\n  line-height: 50px;\n  z-index: 1;\n  background-color: white;\n  overflow: hidden;\n  display: block;\n  cursor: move;\n  box-sizing: border-box;\n  flex-direction: row;\n  position: relative;\n}\n.emptyBox[_ngcontent-%COMP%] {\n  visibility: hidden;\n}\n.controlBox[_ngcontent-%COMP%] {\n  height: 15px;\n  width: 15px;\n  border-radius: 50%;\n  background: black;\n  position: absolute;\n  top: 16px;\n  left: 16px;\n  z-index: 2;\n}\n.editBox[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 2px;\n  top: 2px;\n  width: 15px;\n  height: 15px;\n  padding: 0px;\n  margin: 0px;\n  font-size: 15px;\n  display: none;\n  cursor: pointer;\n}\n.box[_ngcontent-%COMP%]:hover   .editBox[_ngcontent-%COMP%] {\n  display: block;\n}\n.editBox[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 rgba(0, 0, 0, 0.19);\n  opacity: 90%;\n}\n.connector[_ngcontent-%COMP%] {\n  position: fixed;\n  opacity: 30%;\n  z-index: 1;\n  border-radius: 4px;\n}\n.cdk-drag-preview[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  border-radius: 4px;\n  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);\n}\n.cdk-drag-placeholder[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.cdk-drag-animating[_ngcontent-%COMP%] {\n  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);\n}\n.list.cdk-drop-list-dragging[_ngcontent-%COMP%]   .box[_ngcontent-%COMP%]:not(.cdk-drag-placeholder) {\n  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NlZWRyaXgvUHJvZ3JhbW1pbmcvUXVhbnR1bVRyYW5zcGlsZXIvZnJvbnRlbmQvc3JjL3N0eWxlcy5zY3NzIiwic3JjL2FwcC9ncmFwaGljYWwvZ3JhcGhpY2FsLmNvbXBvbmVudC5zY3NzIiwiL2hvbWUvc2VlZHJpeC9Qcm9ncmFtbWluZy9RdWFudHVtVHJhbnNwaWxlci9mcm9udGVuZC9zcmMvYXBwL2dyYXBoaWNhbC9ncmFwaGljYWwuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQVEsb0ZBQUE7QUFFUiw4RUFBQTtBQUNBO0VBQWEsWUFBQTtBQ0NiO0FEQUE7RUFBTyxTQUFBO0VBQVcsaURBQUE7QUNLbEI7QURFQTtFQUNJLGVBQUE7QUNDSjtBREVBO0VBQ0ksK0JBQUE7QUNDSjtBREVBO0VBQ0ksdUJBQUE7QUNDSjtBREVBO0VBQ0ksY0FBQTtBQ0NKO0FERUE7RUFDSSxpQkFBQTtBQ0NKO0FERUE7RUFDSSxxQkFBQTtBQ0NKO0FERUE7Ozs7OztFQU1JLGlDQUFBO0FDQ0o7QURFQTtFQUNDLHFCQUFBO0VBQ0EscUJBQUE7RUFDQSxnQkFBQTtBQ0NEO0FDOUNBO0VBQ0UsdUJBQUE7RUFDQSxXQUFBO0VBQ0EsYUFBQTtFQUNBLGtCQUFBO0FEaURGO0FDOUNBO0VBQ0UsMkJBQUE7QURpREY7QUM5Q0E7RUFDRSxTQUFBO0VBQ0EsUUFBQTtFQUNBLGtCQUFBO0VBRUEsZ0NBQUE7RUFDQSxTQUFBO0FEaURGO0FDOUNBO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxzQkFBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxpQkFBQTtFQUNBLFVBQUE7RUFDQSx1QkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7QURpREY7QUM5Q0E7RUFDRSxrQkFBQTtFQUNBLFNBQUE7RUFDQSxTQUFBO0VBQ0EsdUJBQUE7RUFDQSxVQUFBO0VBQ0Esa0JBQUE7QURpREY7QUM5Q0E7RUFDRSxVQUFBO0VBQ0EscUJBQUE7RUFDQSxrQkFBQTtBRGlERjtBQzlDQTtFQUNFLGNBQUE7RUFDQSxrQkFBQTtBRGlERjtBQzdDQTtFQUNFLFdBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0FEZ0RGO0FDN0NBO0VBQ0Usa0JBQUE7RUFDQSxTQUFBO0VBQ0EsV0FBQTtFQUNBLG1CRmhFSztFRWlFTCxXQUFBO0VBQ0EsV0FBQTtFQUNBLFVBQUE7QURnREY7QUM3Q0E7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLFVBQUE7QURnREY7QUM3Q0E7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLHNCQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtFQUNBLGlCQUFBO0VBQ0EsVUFBQTtFQUNBLHVCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EsWUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtBRGdERjtBQzdDQTtFQUNFLGtCQUFBO0FEZ0RGO0FDN0NBO0VBQ0UsWUFBQTtFQUNBLFdBQUE7RUFDQSxrQkFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxTQUFBO0VBQ0EsVUFBQTtFQUNBLFVBQUE7QURnREY7QUM3Q0E7RUFDRSxrQkFBQTtFQUNBLFVBQUE7RUFDQSxRQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtFQUNBLGVBQUE7RUFDQSxhQUFBO0VBQ0EsZUFBQTtBRGdERjtBQzdDQTtFQUNFLGNBQUE7QURnREY7QUM3Q0E7RUFDRSxnRkFBQTtFQUNBLFlBQUE7QURnREY7QUM1Q0E7RUFDRSxlQUFBO0VBQ0EsWUFBQTtFQUNBLFVBQUE7RUFDQSxrQkFBQTtBRCtDRjtBQzVDQTtFQUNFLHNCQUFBO0VBQ0Esa0JBQUE7RUFDQSxxSEFBQTtBRCtDRjtBQzVDQTtFQUNFLFVBQUE7QUQrQ0Y7QUM1Q0E7RUFDRSxzREFBQTtBRCtDRjtBQzVDQTtFQUNFLHNEQUFBO0FEK0NGIiwiZmlsZSI6InNyYy9hcHAvZ3JhcGhpY2FsL2dyYXBoaWNhbC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgdXJsKCdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PVVidW50dTp3Z2h0QDMwMCZkaXNwbGF5PXN3YXAnKTtcblxuLyogWW91IGNhbiBhZGQgZ2xvYmFsIHN0eWxlcyB0byB0aGlzIGZpbGUsIGFuZCBhbHNvIGltcG9ydCBvdGhlciBzdHlsZSBmaWxlcyAqL1xuaHRtbCwgYm9keSB7IGhlaWdodDogMTAwJTsgfVxuYm9keSB7IG1hcmdpbjogMDsgZm9udC1mYW1pbHk6IFJvYm90bywgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBzYW5zLXNlcmlmOyB9XG5cbiRwcmltYXJ5OiAjM2Y1MWI1O1xuJGRhcms6ICMwMDI5ODQ7XG4kbGlnaHQ6ICM3NTdkZTg7XG5cblxuLnRvb2x0aXAtbGFyZ2Uge1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbn1cblxuLmNvbnRlbnQtbGVmdCB7XG4gICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgIzNmNTFiNTtcbn1cblxuYTpob3ZlciB7XG4gICAgb3BhY2l0eTogODAlICFpbXBvcnRhbnQ7XG59XG5cbi5zZWxlY3Rpb25UaXRsZSB7ICAgIFxuICAgIGNvbG9yOiByZ2IoNjgsIDY4LCA2OCk7XG59XG5cbi50YWItY29udGVudCB7XG4gICAgcGFkZGluZy10b3A6IDEwcHg7XG59XG5cbi5tYXQtdG9vbHRpcCB7XG4gICAgd2hpdGUtc3BhY2U6IHByZS1saW5lO1xufVxuXG5oMSxcbmgyLFxuaDMsXG5oNCxcbmg1LFxuaDYge1xuICAgIGZvbnQtZmFtaWx5OiAnVWJ1bnR1Jywgc2Fucy1zZXJpZjtcbn1cblxuLm15TGluZURlY29yYXRpb24ge1xuXHRiYWNrZ3JvdW5kOiBsaWdodGJsdWU7XG5cdHdpZHRoOiA1cHggIWltcG9ydGFudDtcblx0bWFyZ2luLWxlZnQ6IDNweDtcbn0iLCJAaW1wb3J0IHVybChcImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9VWJ1bnR1OndnaHRAMzAwJmRpc3BsYXk9c3dhcFwiKTtcbi8qIFlvdSBjYW4gYWRkIGdsb2JhbCBzdHlsZXMgdG8gdGhpcyBmaWxlLCBhbmQgYWxzbyBpbXBvcnQgb3RoZXIgc3R5bGUgZmlsZXMgKi9cbmh0bWwsIGJvZHkge1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbmJvZHkge1xuICBtYXJnaW46IDA7XG4gIGZvbnQtZmFtaWx5OiBSb2JvdG8sIFwiSGVsdmV0aWNhIE5ldWVcIiwgc2Fucy1zZXJpZjtcbn1cblxuLnRvb2x0aXAtbGFyZ2Uge1xuICBmb250LXNpemU6IDEycHg7XG59XG5cbi5jb250ZW50LWxlZnQge1xuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjM2Y1MWI1O1xufVxuXG5hOmhvdmVyIHtcbiAgb3BhY2l0eTogODAlICFpbXBvcnRhbnQ7XG59XG5cbi5zZWxlY3Rpb25UaXRsZSB7XG4gIGNvbG9yOiAjNDQ0NDQ0O1xufVxuXG4udGFiLWNvbnRlbnQge1xuICBwYWRkaW5nLXRvcDogMTBweDtcbn1cblxuLm1hdC10b29sdGlwIHtcbiAgd2hpdGUtc3BhY2U6IHByZS1saW5lO1xufVxuXG5oMSxcbmgyLFxuaDMsXG5oNCxcbmg1LFxuaDYge1xuICBmb250LWZhbWlseTogXCJVYnVudHVcIiwgc2Fucy1zZXJpZjtcbn1cblxuLm15TGluZURlY29yYXRpb24ge1xuICBiYWNrZ3JvdW5kOiBsaWdodGJsdWU7XG4gIHdpZHRoOiA1cHggIWltcG9ydGFudDtcbiAgbWFyZ2luLWxlZnQ6IDNweDtcbn1cblxuLmRlbGV0ZUJveCB7XG4gIG91dGxpbmU6IDJweCBkYXNoZWQgcmVkO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxNzRweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4uZGVsZXRlQm94OmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmF5O1xufVxuXG4uZGVsZXRlVGV4dCB7XG4gIGxlZnQ6IDUwJTtcbiAgdG9wOiA1MCU7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgLW1zLXRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgbWFyZ2luOiAwO1xufVxuXG4uZ2F0ZSB7XG4gIHdpZHRoOiA1MHB4O1xuICBoZWlnaHQ6IDUwcHg7XG4gIGJvcmRlcjogc29saWQgMXB4ICNjY2M7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBsaW5lLWhlaWdodDogNTBweDtcbiAgei1pbmRleDogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBjdXJzb3I6IG1vdmU7XG59XG5cbi5xdWJpdE5hbWUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMTVweDtcbiAgbGVmdDogMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgei1pbmRleDogMTtcbiAgcGFkZGluZy1yaWdodDogNXB4O1xufVxuXG4uY3VzdG9tLWNvbnRhaW5lciB7XG4gIHdpZHRoOiA5NSU7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4uY2lyY3VpdCB7XG4gIG92ZXJmbG93OiBhdXRvO1xuICBvdmVyZmxvdy15OiBoaWRkZW47XG59XG5cbi5saXN0IHtcbiAgd2lkdGg6IDEwMCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGJhY2tncm91bmQ6IHdoaXRlO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHotaW5kZXg6IC0xO1xuICBwYWRkaW5nLWxlZnQ6IDI1cHg7XG59XG5cbi5jdXN0b20tY29udGFpbmVyOmFmdGVyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDI1cHg7XG4gIGhlaWdodDogMXB4O1xuICBiYWNrZ3JvdW5kOiAjMDAyOTg0O1xuICBjb250ZW50OiBcIlwiO1xuICB3aWR0aDogMTAwJTtcbiAgei1pbmRleDogMDtcbn1cblxuLnBsYWNlaG9sZGVyIHtcbiAgd2lkdGg6IDYwcHg7XG4gIGhlaWdodDogNjBweDtcbiAgei1pbmRleDogMTtcbn1cblxuLmJveCB7XG4gIHdpZHRoOiA1MHB4O1xuICBoZWlnaHQ6IDUwcHg7XG4gIGJvcmRlcjogc29saWQgMXB4ICNjY2M7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBsaW5lLWhlaWdodDogNTBweDtcbiAgei1pbmRleDogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBjdXJzb3I6IG1vdmU7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuLmVtcHR5Qm94IHtcbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xufVxuXG4uY29udHJvbEJveCB7XG4gIGhlaWdodDogMTVweDtcbiAgd2lkdGg6IDE1cHg7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYmFja2dyb3VuZDogYmxhY2s7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAxNnB4O1xuICBsZWZ0OiAxNnB4O1xuICB6LWluZGV4OiAyO1xufVxuXG4uZWRpdEJveCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IDJweDtcbiAgdG9wOiAycHg7XG4gIHdpZHRoOiAxNXB4O1xuICBoZWlnaHQ6IDE1cHg7XG4gIHBhZGRpbmc6IDBweDtcbiAgbWFyZ2luOiAwcHg7XG4gIGZvbnQtc2l6ZTogMTVweDtcbiAgZGlzcGxheTogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uYm94OmhvdmVyIC5lZGl0Qm94IHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi5lZGl0Qm94OmhvdmVyIHtcbiAgYm94LXNoYWRvdzogMCAxMnB4IDE2cHggMCByZ2JhKDAsIDAsIDAsIDAuMjQpLCAwIDE3cHggNTBweCAwIHJnYmEoMCwgMCwgMCwgMC4xOSk7XG4gIG9wYWNpdHk6IDkwJTtcbn1cblxuLmNvbm5lY3RvciB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgb3BhY2l0eTogMzAlO1xuICB6LWluZGV4OiAxO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG59XG5cbi5jZGstZHJhZy1wcmV2aWV3IHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBib3gtc2hhZG93OiAwIDVweCA1cHggLTNweCByZ2JhKDAsIDAsIDAsIDAuMiksIDAgOHB4IDEwcHggMXB4IHJnYmEoMCwgMCwgMCwgMC4xNCksIDAgM3B4IDE0cHggMnB4IHJnYmEoMCwgMCwgMCwgMC4xMik7XG59XG5cbi5jZGstZHJhZy1wbGFjZWhvbGRlciB7XG4gIG9wYWNpdHk6IDA7XG59XG5cbi5jZGstZHJhZy1hbmltYXRpbmcge1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMjUwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSk7XG59XG5cbi5saXN0LmNkay1kcm9wLWxpc3QtZHJhZ2dpbmcgLmJveDpub3QoLmNkay1kcmFnLXBsYWNlaG9sZGVyKSB7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAyNTBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKTtcbn0iLCJAaW1wb3J0IFwiLi4vLi4vc3R5bGVzLnNjc3NcIjtcblxuLmRlbGV0ZUJveCB7XG4gIG91dGxpbmU6IDJweCBkYXNoZWQgcmVkO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxNzRweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4uZGVsZXRlQm94OmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmF5O1xufVxuXG4uZGVsZXRlVGV4dCB7XG4gIGxlZnQ6IDUwJTtcbiAgdG9wOiA1MCU7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgLW1zLXRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgbWFyZ2luOiAwO1xufVxuXG4uZ2F0ZSB7XG4gIHdpZHRoOiA1MHB4O1xuICBoZWlnaHQ6IDUwcHg7XG4gIGJvcmRlcjogc29saWQgMXB4ICNjY2M7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBsaW5lLWhlaWdodDogNTBweDtcbiAgei1pbmRleDogMTtcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBjdXJzb3I6IG1vdmU7XG59XG5cbi5xdWJpdE5hbWUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMTVweDtcbiAgbGVmdDogMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgei1pbmRleDogMTtcbiAgcGFkZGluZy1yaWdodDogNXB4O1xufVxuXG4uY3VzdG9tLWNvbnRhaW5lciB7XG4gIHdpZHRoOiA5NSU7ICBcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7ICBcbn1cblxuLmNpcmN1aXQge1xuICBvdmVyZmxvdzogYXV0bztcbiAgb3ZlcmZsb3cteTogaGlkZGVuO1xufVxuXG5cbi5saXN0IHtcbiAgd2lkdGg6IDEwMCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGJhY2tncm91bmQ6IHdoaXRlO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHotaW5kZXg6IC0xO1xuICBwYWRkaW5nLWxlZnQ6IDI1cHg7XG59XG5cbi5jdXN0b20tY29udGFpbmVyOmFmdGVyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDI1cHg7XG4gIGhlaWdodDogMXB4O1xuICBiYWNrZ3JvdW5kOiAkZGFyaztcbiAgY29udGVudDogXCJcIjtcbiAgd2lkdGg6IDEwMCU7XG4gIHotaW5kZXg6IDA7XG59XG5cbi5wbGFjZWhvbGRlciB7XG4gIHdpZHRoOiA2MHB4O1xuICBoZWlnaHQ6IDYwcHg7XG4gIHotaW5kZXg6IDE7XG59XG5cbi5ib3gge1xuICB3aWR0aDogNTBweDtcbiAgaGVpZ2h0OiA1MHB4O1xuICBib3JkZXI6IHNvbGlkIDFweCAjY2NjO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgbGluZS1oZWlnaHQ6IDUwcHg7XG4gIHotaW5kZXg6IDE7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBkaXNwbGF5OiBibG9jaztcbiAgY3Vyc29yOiBtb3ZlO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5lbXB0eUJveCB7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbn1cblxuLmNvbnRyb2xCb3gge1xuICBoZWlnaHQ6IDE1cHg7XG4gIHdpZHRoOiAxNXB4O1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGJhY2tncm91bmQ6IGJsYWNrO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMTZweDtcbiAgbGVmdDogMTZweDtcbiAgei1pbmRleDogMjtcbn1cblxuLmVkaXRCb3gge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7ICBcbiAgcmlnaHQ6IDJweDtcbiAgdG9wOiAycHg7XG4gIHdpZHRoOiAxNXB4O1xuICBoZWlnaHQ6IDE1cHg7XG4gIHBhZGRpbmc6IDBweDtcbiAgbWFyZ2luOiAwcHg7XG4gIGZvbnQtc2l6ZTogMTVweDtcbiAgZGlzcGxheTogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uYm94OmhvdmVyIC5lZGl0Qm94IHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi5lZGl0Qm94OmhvdmVyICB7XG4gIGJveC1zaGFkb3c6IDAgMTJweCAxNnB4IDAgcmdiYSgwLDAsMCwwLjI0KSwgMCAxN3B4IDUwcHggMCByZ2JhKDAsMCwwLDAuMTkpO1xuICBvcGFjaXR5OiA5MCU7XG59XG5cblxuLmNvbm5lY3RvciB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgb3BhY2l0eTogMzAlO1xuICB6LWluZGV4OiAxO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG59XG5cbi5jZGstZHJhZy1wcmV2aWV3IHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBib3gtc2hhZG93OiAwIDVweCA1cHggLTNweCByZ2JhKDAsIDAsIDAsIDAuMiksIDAgOHB4IDEwcHggMXB4IHJnYmEoMCwgMCwgMCwgMC4xNCksIDAgM3B4IDE0cHggMnB4IHJnYmEoMCwgMCwgMCwgMC4xMik7XG59XG5cbi5jZGstZHJhZy1wbGFjZWhvbGRlciB7XG4gIG9wYWNpdHk6IDA7XG59XG5cbi5jZGstZHJhZy1hbmltYXRpbmcge1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMjUwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSk7XG59XG5cbi5saXN0LmNkay1kcm9wLWxpc3QtZHJhZ2dpbmcgLmJveDpub3QoLmNkay1kcmFnLXBsYWNlaG9sZGVyKSB7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAyNTBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKTtcbn1cblxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](GraphicalComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-graphical',
                templateUrl: './graphical.component.html',
                styleUrls: ['./graphical.component.scss']
            }]
    }], function () { return [{ type: _services_data_service__WEBPACK_IMPORTED_MODULE_6__["DataService"] }, { type: _services_http_service__WEBPACK_IMPORTED_MODULE_7__["HttpService"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"] }, { type: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_8__["MatSnackBar"] }, { type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
                args: [_angular_common__WEBPACK_IMPORTED_MODULE_3__["DOCUMENT"]]
            }] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] }, { type: _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_9__["MatBottomSheet"] }]; }, { recomputeGateConnections: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"],
            args: ['window:resize', ['$event']]
        }, {
            type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"],
            args: ['window:scroll', ['$event']]
        }] }); })();


/***/ }),

/***/ "./src/app/import/import.component.ts":
/*!********************************************!*\
  !*** ./src/app/import/import.component.ts ***!
  \********************************************/
/*! exports provided: ImportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportComponent", function() { return ImportComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _input_input_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../input/input.component */ "./src/app/input/input.component.ts");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/form-field.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/select.js");
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/core */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/divider */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
/* harmony import */ var _code_code_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../code/code.component */ "./src/app/code/code.component.ts");














class ImportComponent {
    constructor(data) {
        this.data = data;
    }
    ngOnInit() {
    }
    computeInternal() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.child.computeInternal();
        });
    }
}
ImportComponent.ɵfac = function ImportComponent_Factory(t) { return new (t || ImportComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"])); };
ImportComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: ImportComponent, selectors: [["app-import"]], viewQuery: function ImportComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵviewQuery"](_input_input_component__WEBPACK_IMPORTED_MODULE_2__["InputComponent"], true);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵloadQuery"]()) && (ctx.child = _t.first);
    } }, decls: 32, vars: 1, consts: [[1, "container", "pt-2"], [1, "row", "pt-2"], [1, "col"], [1, "w-100"], [3, "selectionChange"], [1, "pl-2", "pt-2", "selectionTitle"], ["value", "OpenQASM"], ["value", "Quil"], ["matTooltip", "Name of the circuit must be qc. All occurences can be changed with CTRL + F2.", "matTooltipClass", "tooltip-large", "value", "Qiskit"], ["matTooltip", "Name of the program must be p. All occurences can be changed with CTRL + F2.", "matTooltipClass", "tooltip-large", "value", "Pyquil"], [1, "col", "text-center"], ["mat-mini-fab", "", "matTooltip", "Import Circuit.", "matTooltipClass", "tooltip-large", "color", "primary", 3, "click"], [1, "container-fluid", "pt-2"], [1, "row"], [1, "col", "content-left"], ["compute", "circuit_to_internal"], ["circuitRef", "internal"], [3, "vertical"]], template: function ImportComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "mat-form-field", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, " Choose Input");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "mat-select", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("selectionChange", function ImportComponent_Template_mat_select_selectionChange_6_listener($event) { return ctx.data.changedInput($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Languages");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "mat-option", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, " OpenQASM ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "mat-option", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, " Quil ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](13, "mat-divider");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Frameworks");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "mat-option", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, " Qiskit ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "mat-option", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, " Pyquil ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "button", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ImportComponent_Template_button_click_21_listener() { return ctx.computeInternal(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "forward");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](24, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](28, "app-input", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](30, "app-code", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](31, "mat-divider", 17);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](31);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vertical", true);
    } }, directives: [_angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__["MatLabel"], _angular_material_select__WEBPACK_IMPORTED_MODULE_5__["MatSelect"], _angular_material_core__WEBPACK_IMPORTED_MODULE_6__["MatOption"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_7__["MatDivider"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__["MatTooltip"], _angular_material_button__WEBPACK_IMPORTED_MODULE_9__["MatButton"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_10__["MatIcon"], _input_input_component__WEBPACK_IMPORTED_MODULE_2__["InputComponent"], _code_code_component__WEBPACK_IMPORTED_MODULE_11__["CodeComponent"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2ltcG9ydC9pbXBvcnQuY29tcG9uZW50LnNjc3MifQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](ImportComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-import',
                templateUrl: './import.component.html',
                styleUrls: ['./import.component.scss'],
            }]
    }], function () { return [{ type: _services_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"] }]; }, { child: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"],
            args: [_input_input_component__WEBPACK_IMPORTED_MODULE_2__["InputComponent"]]
        }] }); })();


/***/ }),

/***/ "./src/app/input/input.component.ts":
/*!******************************************!*\
  !*** ./src/app/input/input.component.ts ***!
  \******************************************/
/*! exports provided: InputComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InputComponent", function() { return InputComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_http_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/http.service */ "./src/app/services/http.service.ts");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
/* harmony import */ var _code_code_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../code/code.component */ "./src/app/code/code.component.ts");










class InputComponent {
    constructor(http, data, snackbar) {
        this.http = http;
        this.data = data;
        this.snackbar = snackbar;
        this.convert = false;
    }
    ngOnInit() {
        if (this.compute === "convert") {
            this.convert = true;
        }
        else {
            this.convert = false;
        }
    }
    inputFile() {
        document.getElementById('fileInput').addEventListener('change', this.readFile.bind(this), false);
        document.getElementById('fileInput').click();
    }
    readFile(event) {
        let file = event.target.files[0]; // FileList object
        console.log(file);
        let extension = file.name.split('.').pop();
        console.log(extension);
        const reader = new FileReader();
        reader.onload = function fileReadCompleted() {
            // when the reader is done, the content is in reader.result.
            this.data.setCircuit("import", reader.result);
        }.bind(this);
        reader.readAsText(file);
    }
    computeInternal() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (!(this.data.options.includes(this.data.inputFormat))) {
                this.snackbar.open("You must choose an input language/framework.");
                return;
            }
            let object = {
                "option": this.data.inputFormat,
                "circuit": this.data.circuits["import"]
            };
            if (this.convert) {
                if (this.data.exportFormat === "") {
                    this.snackbar.open("You must choose an output language/framework.");
                    return;
                }
                object["optionOutput"] = this.data.exportFormat;
            }
            let circuit = yield this.http.callBackend(object, this.compute);
            if (circuit) {
                let index;
                if (this.convert) {
                    index = "export";
                }
                else {
                    index = "internal";
                }
                this.data.setCircuit(index, circuit);
            }
        });
    }
}
InputComponent.ɵfac = function InputComponent_Factory(t) { return new (t || InputComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_http_service__WEBPACK_IMPORTED_MODULE_2__["HttpService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__["MatSnackBar"])); };
InputComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: InputComponent, selectors: [["app-input"]], inputs: { compute: "compute" }, decls: 8, vars: 0, consts: [[1, "container"], [1, "row", "float-left", "pr-2"], ["id", "fileInput", "type", "file"], ["mat-mini-fab", "", "matTooltip", "Import File.", "matTooltipClass", "tooltip-large", "color", "primary", 1, "", 3, "click"], [1, "row", "exportCode", "pr-4"], ["circuitRef", "import"]], template: function InputComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "input", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function InputComponent_Template_button_click_3_listener() { return ctx.inputFile(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "publish");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "app-code", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } }, directives: [_angular_material_button__WEBPACK_IMPORTED_MODULE_5__["MatButton"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_6__["MatTooltip"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__["MatIcon"], _code_code_component__WEBPACK_IMPORTED_MODULE_8__["CodeComponent"]], styles: [".subtitle {\n  opacity: 70%;\n}\n\n.tooltip-large {\n  font-size: 12px;\n}\n\n#fileInput {\n  display: none;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NlZWRyaXgvUHJvZ3JhbW1pbmcvUXVhbnR1bVRyYW5zcGlsZXIvZnJvbnRlbmQvc3JjL2FwcC9pbnB1dC9pbnB1dC5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvaW5wdXQvaW5wdXQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxZQUFBO0FDQ0o7O0FER0E7RUFDSSxlQUFBO0FDQUo7O0FER0E7RUFDSSxhQUFBO0FDQUoiLCJmaWxlIjoic3JjL2FwcC9pbnB1dC9pbnB1dC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5zdWJ0aXRsZSB7XG4gICAgb3BhY2l0eTogNzAlO1xufVxuXG5cbi50b29sdGlwLWxhcmdlIHtcbiAgICBmb250LXNpemU6IDEycHg7XG59XG5cbiNmaWxlSW5wdXQge1xuICAgIGRpc3BsYXk6bm9uZVxufSIsIi5zdWJ0aXRsZSB7XG4gIG9wYWNpdHk6IDcwJTtcbn1cblxuLnRvb2x0aXAtbGFyZ2Uge1xuICBmb250LXNpemU6IDEycHg7XG59XG5cbiNmaWxlSW5wdXQge1xuICBkaXNwbGF5OiBub25lO1xufSJdfQ== */"], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](InputComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-input',
                templateUrl: './input.component.html',
                styleUrls: ['./input.component.scss'],
                encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewEncapsulation"].None,
            }]
    }], function () { return [{ type: _services_http_service__WEBPACK_IMPORTED_MODULE_2__["HttpService"] }, { type: _services_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"] }, { type: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__["MatSnackBar"] }]; }, { compute: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }] }); })();


/***/ }),

/***/ "./src/app/output/output.component.ts":
/*!********************************************!*\
  !*** ./src/app/output/output.component.ts ***!
  \********************************************/
/*! exports provided: OutputComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutputComponent", function() { return OutputComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! file-saver */ "./node_modules/file-saver/dist/FileSaver.min.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
/* harmony import */ var _code_code_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../code/code.component */ "./src/app/code/code.component.ts");









class OutputComponent {
    constructor(data, snackbar) {
        this.data = data;
        this.snackbar = snackbar;
    }
    ngOnInit() {
    }
    download() {
        if (this.data.circuits[2] === "") {
            this.snackbar.open("Circuit is empty.");
            return;
        }
        let format = "";
        if (this.data.exportFormat == "Quil") {
            format = "quil";
        }
        else if (this.data.exportFormat == "OpenQASM") {
            format = "qasm";
        }
        else if (this.data.exportFormat == "Pyquil") {
            format = "py";
        }
        else if (this.data.exportFormat == "Qiskit") {
            format = "py";
        }
        else {
            this.snackbar.open("No valid format selected.");
            return;
        }
        var blob = new Blob([this.data.circuits["export"]], { type: "text/plain;charset=utf-8" });
        Object(file_saver__WEBPACK_IMPORTED_MODULE_1__["saveAs"])(blob, "circuit." + format);
    }
}
OutputComponent.ɵfac = function OutputComponent_Factory(t) { return new (t || OutputComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_data_service__WEBPACK_IMPORTED_MODULE_2__["DataService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__["MatSnackBar"])); };
OutputComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: OutputComponent, selectors: [["app-output"]], decls: 6, vars: 0, consts: [[1, "row", "float-right", "pr-2"], ["mat-mini-fab", "", "matTooltip", "Download Circuit.", "matTooltipClass", "tooltip-large", "color", "primary", 1, "float-right", 3, "click"], [1, "row", "exportCode", "pr-4"], ["circuitRef", "export", 1, "pt-2"]], template: function OutputComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "button", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function OutputComponent_Template_button_click_1_listener() { return ctx.download(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "system_update");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "app-code", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_material_button__WEBPACK_IMPORTED_MODULE_4__["MatButton"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_5__["MatTooltip"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__["MatIcon"], _code_code_component__WEBPACK_IMPORTED_MODULE_7__["CodeComponent"]], styles: [".content-left {\n  border-right: 1px solid #3f51b5;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NlZWRyaXgvUHJvZ3JhbW1pbmcvUXVhbnR1bVRyYW5zcGlsZXIvZnJvbnRlbmQvc3JjL2FwcC9vdXRwdXQvb3V0cHV0LmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9vdXRwdXQvb3V0cHV0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksK0JBQUE7QUNDSiIsImZpbGUiOiJzcmMvYXBwL291dHB1dC9vdXRwdXQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY29udGVudC1sZWZ0IHtcbiAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjM2Y1MWI1O1xufSIsIi5jb250ZW50LWxlZnQge1xuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjM2Y1MWI1O1xufSJdfQ== */"], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](OutputComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-output',
                templateUrl: './output.component.html',
                styleUrls: ['./output.component.scss'],
                encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewEncapsulation"].None,
            }]
    }], function () { return [{ type: _services_data_service__WEBPACK_IMPORTED_MODULE_2__["DataService"] }, { type: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__["MatSnackBar"] }]; }, null); })();


/***/ }),

/***/ "./src/app/services/Operation.ts":
/*!***************************************!*\
  !*** ./src/app/services/Operation.ts ***!
  \***************************************/
/*! exports provided: Operation, OperationIndex, gateMap, importantGatesList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Operation", function() { return Operation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OperationIndex", function() { return OperationIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gateMap", function() { return gateMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "importantGatesList", function() { return importantGatesList; });
class Operation {
    constructor(name, numberOfQubits = 1, numberOfParameter = 0, numberOfClbits = 0, numberOfCtrlBits = 0) {
        this.name = name;
        this.numberOfParameter = numberOfParameter;
        this.numberOfQubits = numberOfQubits;
        this.numberOfClbits = numberOfClbits;
        this.numberOfCtrlBits = numberOfCtrlBits;
    }
    generateList(number) {
        let list = [];
        for (let i = 0; i < number; i++) {
            list.push(null);
        }
        return list;
    }
}
class OperationIndex {
    constructor(index, operation, parameter, qubits, clbits, lineNumbersInCircuit, placeholder = false, control = false) {
        this.index = index;
        this.operation = operation;
        this.parameter = parameter;
        this.qubits = qubits;
        this.clbits = clbits;
        this.lineNumbersInCircuit = lineNumbersInCircuit;
        this.placeholder = placeholder;
        this.control = control;
    }
}
// gates
const H = new Operation("H");
const I = new Operation("I");
const S = new Operation("S");
const SX = new Operation("SX");
const SXDG = new Operation("SXDG");
const SDG = new Operation("SDG");
const T = new Operation("T");
const TDG = new Operation("TDG");
const U = new Operation("U", 1, 3);
const U1 = new Operation("U1", 1, 1);
const U2 = new Operation("U2", 1, 2);
const U3 = new Operation("U3", 1, 3);
const X = new Operation("X");
const Y = new Operation("Y");
const Z = new Operation("Z");
const CCX = new Operation("CCX", 3, 0, 0, 2);
const C3X = new Operation("C3X", 4, 0, 0, 3);
const C4X = new Operation("C4X", 5, 0, 0, 2);
const DCX = new Operation("DCX", 2, 0, 0, 0);
const CH = new Operation("CH", 2, 0, 0, 1);
const CPHASE = new Operation("CPHASE", 2, 1, 0, 1);
const CRX = new Operation("CRX", 2, 1, 0, 1);
const CRY = new Operation("CRY", 2, 1, 0, 1);
const CRZ = new Operation("CRZ", 2, 1, 0, 1);
const CSWAP = new Operation("CSWAP", 3, 0, 0, 1);
const CSX = new Operation("CSX", 2, 0, 0, 1);
const CU = new Operation("CU", 2, 4, 0, 1);
const CU1 = new Operation("CU1", 2, 1, 0, 1);
const CU3 = new Operation("CU3", 2, 3, 0, 1);
const CX = new Operation("CX", 2, 0, 0, 1);
const CY = new Operation("CY", 2, 0, 0, 1);
const CZ = new Operation("CZ", 2, 0, 0, 1);
const MS = new Operation("MS", 2, 0, 0, 0);
const PHASE = new Operation("PHASE", 1, 1, 0, 0);
const RCCX = new Operation("RCCX", 3, 0, 0, 2);
const RC3X = new Operation("RC3X", 4, 0, 0, 3);
const RX = new Operation("RCCX", 1, 1, 0, 0);
const RXX = new Operation("RXX", 2, 1, 0, 0);
const RY = new Operation("RY", 1, 1, 0, 0);
const RYY = new Operation("RYY", 2, 1, 0, 0);
const RZ = new Operation("RZ", 1, 1, 0, 0);
const RZZ = new Operation("RZZ", 2, 1, 0, 0);
const RZX = new Operation("RZZ", 2, 1, 0, 0);
const SWAP = new Operation("SWAP", 2, 0, 0, 0);
const ISWAP = new Operation("ISWAP", 2, 0, 0, 0);
// other instructions
const BARRIER = new Operation("Barrier", -1);
const MEASURE = new Operation("Measure", 1, 0, 1);
let importantGatesMap = {
    "h": H,
    "x": X,
    "y": Y,
    "z": Z,
    "i": I,
    "s": S,
    "t": T,
    "u1": U1,
    "u2": U2,
    "u3": U3,
    "swap": SWAP,
    "rx": RXX,
    "rz": RZ,
    "ry": RY,
    "phase": PHASE,
    "cu1": CU1,
    "cu3": CU3,
    "cx": CX,
    "cy": CY,
    "cz": CZ,
    "crx": CRX,
    "cry": CRY,
    "crz": CRZ,
    "cphase": CPHASE,
    "barrier": BARRIER,
    "measure": MEASURE
};
let gateMap = {
    "u": U,
    "sx": SX,
    "sxdg": SXDG,
    "sdg": SDG,
    "tdg": TDG,
    "ccx": CCX,
    "c3x": C3X,
    "c4x": C4X,
    "dcx": DCX,
    "ch": CH,
    "cswap": CSWAP,
    "csx": CSX,
    "cu": CU,
    "ms": MS,
    "rccx": RCCX,
    "rc3x": RC3X,
    "rxx": RXX,
    "ryy": RYY,
    "rzz": RZZ,
    "rzx": RZX,
    "iswap": ISWAP,
};
for (let key in importantGatesMap) {
    gateMap[key] = importantGatesMap[key];
}
let importantGatesList = [];
for (let key in importantGatesMap) {
    importantGatesList.push(importantGatesMap[key]);
}


/***/ }),

/***/ "./src/app/services/Utility.ts":
/*!*************************************!*\
  !*** ./src/app/services/Utility.ts ***!
  \*************************************/
/*! exports provided: ConnectorAttributes, delay, insert */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectorAttributes", function() { return ConnectorAttributes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "delay", function() { return delay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "insert", function() { return insert; });
class ConnectorAttributes {
    constructor(measure = false) {
        this.yBot = 0;
        this.yTop = Number.MAX_VALUE;
        this.xLeft = 0;
        this.xRight = 0;
        this.measure = false;
        this.measure = measure;
    }
    setYTop(yTop) {
        if (yTop < this.yTop) {
            this.yTop = yTop;
        }
    }
    setYBot(yBot) {
        if (yBot > this.yBot) {
            this.yBot = yBot;
        }
    }
    setXRight(xRight) {
        this.xRight = xRight;
    }
    setYLeft(xLeft) {
        this.xLeft = xLeft;
    }
    getWidth() {
        return this.xRight - this.xLeft;
    }
    getHeight() {
        return this.yBot - this.yTop;
    }
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function insert(arr, index, newItem) {
    return [
        // part of the array before the specified index
        ...arr.slice(0, index),
        // inserted item
        newItem,
        // part of the array after the specified index
        ...arr.slice(index)
    ];
}


/***/ }),

/***/ "./src/app/services/data.service.ts":
/*!******************************************!*\
  !*** ./src/app/services/data.service.ts ***!
  \******************************************/
/*! exports provided: DataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataService", function() { return DataService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _Operation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Operation */ "./src/app/services/Operation.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");




class DataService {
    constructor() {
        this.circuitChanged = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](false);
        this.highlightLines = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"]([]);
        this.options = ["OpenQASM", "Quil", "Qiskit", "Pyquil"];
        this.inputFormat = "";
        this.exportFormat = "";
        this.circuits = {
            "import": `DECLARE ro BIT[3]
H 0
H 1
H 2
H 1
CNOT 2 3
CPHASE (0) 1 0
CNOT 2 4
H 0
CPHASE (0) 1 2
CPHASE (0) 0 2
H 2
MEASURE 0 ro[0]
MEASURE 1 ro[1]
MEASURE 2 ro[2]
`,
            "internal": "",
            "unroll": "",
            "export": ""
        };
        this.numQbits = 0;
        this.numClbits = 0;
        this.numBits = 0;
        this.qubitNames = [];
        this.clbitNames = [];
        this.bitNames = [];
        this.maxIndexTotal = 0;
        this.currentIndex = Array(this.numBits).fill(-1);
        this.operationsAtBit = [];
        this.firstOperationAt = 0;
        this.numberOfLines = 0;
        this.parseCircuit();
    }
    setCircuit(index, circuit) {
        this.circuits[index] = circuit;
        if (index == "internal") {
            this.parseCircuit();
        }
    }
    setCircuitOnWrite(circuitRef, circuit) {
        try {
            this.setCircuit(circuitRef, circuit);
        }
        catch (e) {
            // happens when a user is changing the circuit (and data is just partly changed), but should not happen otherwise
            console.log("Circuit data cannot be parsed.");
            // console.log(e)
        }
    }
    parseCircuit() {
        // temp variables
        let numQbits = 0;
        let numClbits = 0;
        let numBits = 0;
        let maxIndexTotal = 0;
        let qubitNames = [];
        let clbitNames = [];
        let bitNames = [];
        let currentIndex = Array(this.numBits).fill(-1);
        let operationsAtBit = [];
        let firstOperationAt = -1;
        let circuit = this.circuits["internal"];
        let arrayOfLines = circuit.split("\n");
        let numberOfLines = arrayOfLines.length;
        arrayOfLines.forEach((line, lineNumber) => {
            if (line.includes("QuantumCircuit")) {
                let afterBracket = line.split("(")[1].replace(")", "");
                let numbers = afterBracket.split(",");
                numQbits = parseInt(numbers[0].trim());
                if (numbers.length > 1) {
                    numClbits = parseInt(numbers[1].trim());
                }
                // TODO handle imports via registers
                for (let i = 0; i < numQbits; i++) {
                    qubitNames.push(i);
                }
                for (let i = 0; i < numClbits; i++) {
                    clbitNames.push(i);
                }
                bitNames = qubitNames.concat(clbitNames);
                numBits = numQbits + numClbits;
                for (let i = 0; i < numBits; i++) {
                    operationsAtBit.push([]);
                }
            }
            else if (line.includes("qc.")) {
                if (firstOperationAt == -1) {
                    firstOperationAt = lineNumber;
                }
                let lineTrimmed = line.replace(/qc./g, "").trim();
                let lineSplitted = lineTrimmed.split("(");
                let operationString = lineSplitted[0];
                let parameters = lineSplitted[1].replace(")", "").split(",");
                let operation = _Operation__WEBPACK_IMPORTED_MODULE_1__["gateMap"][operationString];
                let paramsWithoutBits = [];
                let qubits = [];
                let clbits = [];
                for (let i = 0; i < operation.numberOfParameter; i++) {
                    paramsWithoutBits.push(parameters[i].trim());
                }
                for (let i = operation.numberOfParameter; i < (operation.numberOfParameter + operation.numberOfQubits); i++) {
                    qubits.push(parseInt(parameters[i].trim()));
                }
                for (let i = operation.numberOfParameter + operation.numberOfQubits; i < (operation.numberOfParameter + operation.numberOfQubits + operation.numberOfClbits); i++) {
                    clbits.push(parseInt(parameters[i].trim()));
                }
                // compute max index
                let maxIndex = 0;
                qubits.forEach(qubit => {
                    if (currentIndex[qubit] > maxIndex) {
                        maxIndex = currentIndex[qubit];
                    }
                });
                clbits.forEach(clbit => {
                    if (currentIndex[clbit + qubitNames.length] > maxIndex) {
                        maxIndex = currentIndex[clbit + qubitNames.length];
                    }
                });
                let lastIndex = maxIndex;
                maxIndex += 1;
                if (maxIndex > maxIndexTotal) {
                    maxIndexTotal = maxIndex;
                }
                let lineNumbers = [lineNumber];
                let operationIndex = new _Operation__WEBPACK_IMPORTED_MODULE_1__["OperationIndex"](maxIndex, operation, paramsWithoutBits, qubits, clbits, lineNumbers);
                let operationIndexControl = new _Operation__WEBPACK_IMPORTED_MODULE_1__["OperationIndex"](maxIndex, operation, paramsWithoutBits, qubits, clbits, lineNumbers, false, true);
                let placeholder = new _Operation__WEBPACK_IMPORTED_MODULE_1__["OperationIndex"](maxIndex, operation, paramsWithoutBits, qubits, clbits, lineNumbers, true);
                // fill operations at index
                let numCtrlBits = operation.numberOfCtrlBits;
                if (operation.name == "Barrier") {
                    for (let i = 0; i < bitNames.length; i++) {
                        this.fillPlaceholders(maxIndexTotal - 1, i, operationsAtBit, placeholder);
                        operationsAtBit[i][maxIndexTotal] = operationIndex;
                        currentIndex[maxIndexTotal + 1];
                    }
                    maxIndexTotal++;
                    return;
                }
                // set max index in arrays
                qubits.forEach(qubit => {
                    currentIndex[qubit] = maxIndex;
                });
                clbits.forEach(clbit => {
                    currentIndex[clbit + qubitNames.length] = maxIndex;
                });
                qubits.forEach((qubit, index) => {
                    this.fillPlaceholders(lastIndex, qubit, operationsAtBit, placeholder);
                    // control qubit
                    if (numCtrlBits > index) {
                        operationsAtBit[qubit][lastIndex] = operationIndexControl;
                        // target qubit
                    }
                    else {
                        operationsAtBit[qubit][lastIndex] = operationIndex;
                    }
                });
                clbits.forEach((clbit, index) => {
                    clbit = clbit + qubitNames.length;
                    this.fillPlaceholders(lastIndex, clbit, operationsAtBit, placeholder);
                    operationsAtBit[clbit][lastIndex] = operationIndex;
                });
            }
        });
        // at the end if parsing errors occur, the data is not written partly
        this.numQbits = numQbits;
        this.numClbits = numClbits;
        this.numBits = numBits;
        this.maxIndexTotal = maxIndexTotal;
        this.qubitNames = qubitNames;
        this.clbitNames = clbitNames;
        this.bitNames = bitNames;
        this.currentIndex = currentIndex;
        this.operationsAtBit = operationsAtBit;
        this.firstOperationAt = firstOperationAt;
        this.numberOfLines = numberOfLines;
        // fire event to notify components
        this.circuitChanged.next(true);
    }
    fillPlaceholders(lastIndex, bit, operationsAtBit, placeholder) {
        if (lastIndex > operationsAtBit[bit].length - 1) {
            for (let i = operationsAtBit[bit].length; i <= lastIndex; i++) {
                operationsAtBit[bit].push(placeholder);
            }
        }
    }
    removeOperationAtIndex(index, qubitIndex) {
        let operationIndex = this.operationsAtBit[qubitIndex][index];
        this.removeOperation(operationIndex);
    }
    removeOperation(operationIndex) {
        let lineNumbers = operationIndex.lineNumbersInCircuit;
        let lines = this.circuits["internal"].split('\n');
        lineNumbers.forEach(lineNumber => {
            lines.splice(lineNumber, 1);
        });
        this.circuits["internal"] = lines.join('\n');
        this.parseCircuit();
    }
    addOperationIndex(operationIndex) {
        let lines = this.circuits["internal"].split('\n');
        let lineToInsert = operationIndex.lineNumbersInCircuit[0];
        lines.splice(lineToInsert, 0, `qc.${operationIndex.operation.name.toLowerCase()}(${this.generateStringFromArguments(operationIndex)})`);
        this.circuits["internal"] = lines.join('\n');
        this.parseCircuit();
    }
    getLinesToInsert(index, qubitIndex) {
        let lineToInsert = this.firstOperationAt;
        if (index < this.operationsAtBit[qubitIndex].length) {
            let lineNumbersInCircuit = this.operationsAtBit[qubitIndex][index].lineNumbersInCircuit;
            lineToInsert = lineNumbersInCircuit[0];
        }
        else {
            lineToInsert = this.numberOfLines;
        }
        return lineToInsert;
    }
    getLinesToInsertEvent(previousIndex, index, qubitIndex) {
        let lineToInsert = this.firstOperationAt;
        if (index < this.operationsAtBit[qubitIndex].length) {
            let lineNumbersInCircuit = this.operationsAtBit[qubitIndex][index].lineNumbersInCircuit;
            lineToInsert = lineNumbersInCircuit[0];
            // needed, because element should be placed after the existing element
            if (previousIndex < index) {
                lineToInsert = lineNumbersInCircuit[lineNumbersInCircuit.length - 1] + 1;
            }
        }
        else {
            lineToInsert = this.numberOfLines;
        }
        return lineToInsert;
    }
    editOperation(operationIndex, linesToRemove) {
        let lines = this.circuits["internal"].split('\n');
        lines = this.editOperationLines(lines, operationIndex, linesToRemove);
        this.circuits["internal"] = lines.join('\n');
        this.parseCircuit();
    }
    editOperationLines(lines, operationIndex, linesToRemove) {
        let lineToInsert = operationIndex.lineNumbersInCircuit[0];
        // remove old lines
        if (linesToRemove) {
            linesToRemove.forEach(lineNumber => {
                lines.splice(lineNumber, 1);
            });
            if (linesToRemove[0] < lineToInsert) {
                lineToInsert -= linesToRemove.length;
            }
            // add line
            lines.splice(lineToInsert, 0, `qc.${operationIndex.operation.name.toLowerCase()}(${this.generateStringFromArguments(operationIndex)})`);
            // otherwise just edit the old line
        }
        else {
            lines[lineToInsert] = `qc.${operationIndex.operation.name.toLowerCase()}(${this.generateStringFromArguments(operationIndex)})`;
        }
        return lines;
    }
    generateStringFromArguments(operationIndex) {
        // barrier is applied to all qubits
        if (operationIndex.operation.name == "Barrier") {
            return "";
        }
        let string = "";
        string += this.listToString(operationIndex.parameter);
        let nextString = this.listToString(operationIndex.qubits);
        if (string != "" && nextString != "") {
            string += ", ";
        }
        string += nextString;
        nextString = this.listToString(operationIndex.clbits);
        if (string != "" && nextString != "") {
            string += ", ";
        }
        string += nextString;
        return string;
    }
    listToString(list) {
        let string = "";
        for (let i = 0; i < list.length; i++) {
            if (i < list.length - 1) {
                string += list[i] + ", ";
            }
            else {
                string += list[i];
            }
        }
        return string;
    }
    setMaxIndex() {
        let max = -1;
        this.currentIndex.forEach(index => {
            if (index > max) {
                max = index;
            }
        });
        this.maxIndexTotal = max;
    }
    setExportCircuit(circuit, format) {
        this.setCircuit("export", circuit);
        this.exportFormat = format;
    }
    getCircuit(circuitRef) {
        if (circuitRef == "current") {
            if (this.circuits["unroll"] != "") {
                return this.circuits["unroll"];
            }
            return this.circuits["internal"];
        }
        return this.circuits[circuitRef];
    }
    changedInput(event) {
        this.inputFormat = event.value;
    }
    changedExport(event) {
        this.exportFormat = event.value;
    }
}
DataService.ɵfac = function DataService_Factory(t) { return new (t || DataService)(); };
DataService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: DataService, factory: DataService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](DataService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "./src/app/services/http.service.ts":
/*!******************************************!*\
  !*** ./src/app/services/http.service.ts ***!
  \******************************************/
/*! exports provided: HttpService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpService", function() { return HttpService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");







const url = _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl;
// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type':  'application/json',
//   }),
//   responseType: 'text' as 'text'
// };
const headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({
    'Content-Type': 'application/json',
});
class HttpService {
    constructor(http, snackbar) {
        this.http = http;
        this.snackbar = snackbar;
    }
    callBackend(data, path) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            let dataJSON = JSON.stringify(data);
            try {
                let circuit = yield this.http.post(url + path, dataJSON, { headers, responseType: 'text' }).toPromise();
                this.snackbar.open("Successfully processed the data.");
                return circuit;
            }
            catch (err) {
                console.log(err);
                console.log("Backend error:" + err.error);
                this.snackbar.open("Error at handling the data. The log shows detailed information about this error.");
            }
        });
    }
}
HttpService.ɵfac = function HttpService_Factory(t) { return new (t || HttpService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__["MatSnackBar"])); };
HttpService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: HttpService, factory: HttpService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](HttpService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"],
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }, { type: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__["MatSnackBar"] }]; }, null); })();


/***/ }),

/***/ "./src/app/simulate/simulate.component.ts":
/*!************************************************!*\
  !*** ./src/app/simulate/simulate.component.ts ***!
  \************************************************/
/*! exports provided: SimulateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimulateComponent", function() { return SimulateComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_http_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/http.service */ "./src/app/services/http.service.ts");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/divider */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular-bootstrap-md */ "./node_modules/angular-bootstrap-md/__ivy_ngcc__/fesm2015/angular-bootstrap-md.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");










function SimulateComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "mat-divider", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "canvas", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("chartHover", function SimulateComponent_div_1_Template_canvas_chartHover_4_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r2); const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r1.chartHovered($event); })("chartClick", function SimulateComponent_div_1_Template_canvas_chartClick_4_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r2); const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r3.chartClicked($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "button", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function SimulateComponent_div_1_Template_button_click_5_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r2); const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r4.simulate(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "redo");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Recompute");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("chartType", ctx_r0.chartType)("datasets", ctx_r0.chartDatasets)("labels", ctx_r0.chartLabels)("colors", ctx_r0.chartColors)("options", ctx_r0.chartOptions)("legend", true);
} }
class SimulateComponent {
    constructor(http, data) {
        this.http = http;
        this.data = data;
        this.counts = [];
        // chart attributes
        this.chartType = 'bar';
        this.chartDatasets = [];
        this.chartLabels = [];
        this.chartColors = [
            {
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2,
            }
        ];
        this.chartOptions = {
            responsive: true,
            scales: {
                yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                xAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
            }
        };
    }
    chartClicked(e) { }
    chartHovered(e) { }
    ngOnInit() {
    }
    simulate() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            let object = {
                "circuit": this.data.getCircuit("internal")
            };
            let counts = yield this.http.callBackend(object, "simulate");
            let countObject = JSON.parse(counts);
            // countObject = this.appendCounts(countObject)
            if (countObject) {
                this.counts.push(countObject);
                let chartData = [];
                let chartLabels = [];
                for (let key in countObject) {
                    let value = countObject[key];
                    if (!(key in this.chartLabels)) {
                        chartLabels.push(key);
                    }
                    chartData.push(value);
                }
                this.chartDatasets = [{
                        data: chartData,
                        label: "Counts"
                    }];
                this.chartLabels = chartLabels;
                // this.bottomDiv.nativeElement.scrollIntoView({ block: 'end',  behavior: 'smooth' });
            }
        });
    }
}
SimulateComponent.ɵfac = function SimulateComponent_Factory(t) { return new (t || SimulateComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_http_service__WEBPACK_IMPORTED_MODULE_2__["HttpService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"])); };
SimulateComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: SimulateComponent, selectors: [["app-simulate"]], decls: 2, vars: 1, consts: [[1, "tab-content"], ["class", "chart", 4, "ngIf"], [1, "chart"], [1, "mt-3"], [1, "row", "pt-3"], [2, "display", "block"], ["mdbChart", "", 3, "chartType", "datasets", "labels", "colors", "options", "legend", "chartHover", "chartClick"], ["mat-raised-button", "", 1, "mt-1", "w-100", "pt-1", "pb-1", 3, "click"]], template: function SimulateComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, SimulateComponent_div_1_Template, 9, 6, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.counts.length != 0);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_5__["MatDivider"], angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_6__["BaseChartDirective"], _angular_material_button__WEBPACK_IMPORTED_MODULE_7__["MatButton"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__["MatIcon"]], styles: [".chart[_ngcontent-%COMP%] {\n  width: 95%;\n}\n\n.redoButton[_ngcontent-%COMP%] {\n  width: 95%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NlZWRyaXgvUHJvZ3JhbW1pbmcvUXVhbnR1bVRyYW5zcGlsZXIvZnJvbnRlbmQvc3JjL2FwcC9zaW11bGF0ZS9zaW11bGF0ZS5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvc2ltdWxhdGUvc2ltdWxhdGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxVQUFBO0FDQ0o7O0FERUE7RUFDSSxVQUFBO0FDQ0oiLCJmaWxlIjoic3JjL2FwcC9zaW11bGF0ZS9zaW11bGF0ZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jaGFydCB7XG4gICAgd2lkdGg6IDk1JTtcbn1cblxuLnJlZG9CdXR0b24ge1xuICAgIHdpZHRoOiA5NSU7XG59IiwiLmNoYXJ0IHtcbiAgd2lkdGg6IDk1JTtcbn1cblxuLnJlZG9CdXR0b24ge1xuICB3aWR0aDogOTUlO1xufSJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](SimulateComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-simulate',
                templateUrl: './simulate.component.html',
                styleUrls: ['./simulate.component.scss']
            }]
    }], function () { return [{ type: _services_http_service__WEBPACK_IMPORTED_MODULE_2__["HttpService"] }, { type: _services_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/stepper/stepper.component.ts":
/*!**********************************************!*\
  !*** ./src/app/stepper/stepper.component.ts ***!
  \**********************************************/
/*! exports provided: StepperComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StepperComponent", function() { return StepperComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
/* harmony import */ var _angular_material_stepper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/stepper */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/stepper.js");
/* harmony import */ var _import_import_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../import/import.component */ "./src/app/import/import.component.ts");
/* harmony import */ var _circuit_circuit_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../circuit/circuit.component */ "./src/app/circuit/circuit.component.ts");
/* harmony import */ var _analyze_analyze_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../analyze/analyze.component */ "./src/app/analyze/analyze.component.ts");









const _c0 = ["analyze"];
function StepperComponent_ng_template_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](0, "Import");
} }
function StepperComponent_ng_template_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](0, "Visualize and Edit ");
} }
function StepperComponent_ng_template_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](0, "Transpile and Export");
} }
class StepperComponent {
    constructor(snackbar, _formBuilder) {
        this.snackbar = snackbar;
        this._formBuilder = _formBuilder;
    }
    ngOnInit() {
        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]
        });
    }
    onStepChange(event) {
        let index = event.selectedIndex;
        if (index == 2) {
            this.showInformation();
            this.analyzeComponent.analyse();
        }
    }
    showInformation() {
        this.snackbar.open("Request sent to backend. Results will be available shortly.");
    }
}
StepperComponent.ɵfac = function StepperComponent_Factory(t) { return new (t || StepperComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"])); };
StepperComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: StepperComponent, selectors: [["app-stepper"]], viewQuery: function StepperComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c0, true);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.analyzeComponent = _t.first);
    } }, decls: 13, vars: 3, consts: [[1, "container-fluid"], [3, "selectionChange"], ["stepper", ""], ["state", "input", 3, "stepControl"], ["matStepLabel", ""], ["state", "circuit", 3, "stepControl"], ["analyze", ""]], template: function StepperComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-horizontal-stepper", 1, 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("selectionChange", function StepperComponent_Template_mat_horizontal_stepper_selectionChange_1_listener($event) { return ctx.onStepChange($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "mat-step", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, StepperComponent_ng_template_4_Template, 1, 0, "ng-template", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "app-import");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "mat-step", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, StepperComponent_ng_template_7_Template, 1, 0, "ng-template", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "app-circuit");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "mat-step", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, StepperComponent_ng_template_10_Template, 1, 0, "ng-template", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](11, "app-analyze", null, 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("stepControl", ctx.firstFormGroup);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("stepControl", ctx.firstFormGroup);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("stepControl", ctx.firstFormGroup);
    } }, directives: [_angular_material_stepper__WEBPACK_IMPORTED_MODULE_3__["MatHorizontalStepper"], _angular_material_stepper__WEBPACK_IMPORTED_MODULE_3__["MatStep"], _angular_material_stepper__WEBPACK_IMPORTED_MODULE_3__["MatStepLabel"], _import_import_component__WEBPACK_IMPORTED_MODULE_4__["ImportComponent"], _circuit_circuit_component__WEBPACK_IMPORTED_MODULE_5__["CircuitComponent"], _analyze_analyze_component__WEBPACK_IMPORTED_MODULE_6__["AnalyzeComponent"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3N0ZXBwZXIvc3RlcHBlci5jb21wb25lbnQuc2NzcyJ9 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](StepperComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-stepper',
                templateUrl: './stepper.component.html',
                styleUrls: ['./stepper.component.scss'],
            }]
    }], function () { return [{ type: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"] }, { type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"] }]; }, { analyzeComponent: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['analyze', { static: false }]
        }] }); })();


/***/ }),

/***/ "./src/app/tab/tab.component.ts":
/*!**************************************!*\
  !*** ./src/app/tab/tab.component.ts ***!
  \**************************************/
/*! exports provided: TabComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TabComponent", function() { return TabComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/tabs */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tabs.js");
/* harmony import */ var _graphical_graphical_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../graphical/graphical.component */ "./src/app/graphical/graphical.component.ts");
/* harmony import */ var _simulate_simulate_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../simulate/simulate.component */ "./src/app/simulate/simulate.component.ts");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");








const _c0 = ["simulate"];
const _c1 = ["analyze"];
function TabComponent_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-icon", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "view_list");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Graphical Representation ");
} }
function TabComponent_ng_template_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-icon", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "memory");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Simulate ");
} }
class TabComponent {
    constructor(snackbar, data) {
        this.snackbar = snackbar;
        this.data = data;
    }
    ngOnInit() {
    }
    tabClick(event) {
        let index = event.index;
        if (index == 1) {
            this.showInformation();
            this.simulateComponent.simulate();
        }
        else if (index == 2) {
            this.showInformation();
            this.analyzeComponent.analyse();
        }
    }
    showInformation() {
        this.snackbar.open("Request sent to backend. Results will be available shortly.");
    }
}
TabComponent.ɵfac = function TabComponent_Factory(t) { return new (t || TabComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_1__["MatSnackBar"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_data_service__WEBPACK_IMPORTED_MODULE_2__["DataService"])); };
TabComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: TabComponent, selectors: [["app-tab"]], viewQuery: function TabComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c0, true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c1, true);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.simulateComponent = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.analyzeComponent = _t.first);
    } }, decls: 8, vars: 0, consts: [["mat-align-tabs", "center", "mat-stretch-tabs", "", 3, "selectedTabChange"], ["label", "Graphical Representation"], ["mat-tab-label", "", "class", "pb-3"], [1, "tab-content"], ["label", "Simulate"], ["mat-tab-label", ""], ["simulate", ""], [1, "tab-icon"]], template: function TabComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-tab-group", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("selectedTabChange", function TabComponent_Template_mat_tab_group_selectedTabChange_0_listener($event) { return ctx.tabClick($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-tab", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, TabComponent_ng_template_2_Template, 3, 0, "ng-template", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "app-graphical", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "mat-tab", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, TabComponent_ng_template_5_Template, 3, 0, "ng-template", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "app-simulate", 3, 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__["MatTabGroup"], _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__["MatTab"], _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__["MatTabLabel"], _graphical_graphical_component__WEBPACK_IMPORTED_MODULE_4__["GraphicalComponent"], _simulate_simulate_component__WEBPACK_IMPORTED_MODULE_5__["SimulateComponent"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__["MatIcon"]], styles: [".tab-icon[_ngcontent-%COMP%] {\n  margin-right: 8px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NlZWRyaXgvUHJvZ3JhbW1pbmcvUXVhbnR1bVRyYW5zcGlsZXIvZnJvbnRlbmQvc3JjL2FwcC90YWIvdGFiLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC90YWIvdGFiLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0ksaUJBQUE7QUNBSiIsImZpbGUiOiJzcmMvYXBwL3RhYi90YWIuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJcbi50YWItaWNvbiB7XG4gICAgbWFyZ2luLXJpZ2h0OiA4cHg7XG59XG4gIFxuIiwiLnRhYi1pY29uIHtcbiAgbWFyZ2luLXJpZ2h0OiA4cHg7XG59Il19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TabComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-tab',
                templateUrl: './tab.component.html',
                styleUrls: ['./tab.component.scss']
            }]
    }], function () { return [{ type: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_1__["MatSnackBar"] }, { type: _services_data_service__WEBPACK_IMPORTED_MODULE_2__["DataService"] }]; }, { simulateComponent: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ["simulate", { static: false }]
        }], analyzeComponent: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['analyze', { static: false }]
        }] }); })();


/***/ }),

/***/ "./src/app/unroll/unroll.component.ts":
/*!********************************************!*\
  !*** ./src/app/unroll/unroll.component.ts ***!
  \********************************************/
/*! exports provided: UnrollComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UnrollComponent", function() { return UnrollComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_Operation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/Operation */ "./src/app/services/Operation.ts");
/* harmony import */ var _services_http_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/http.service */ "./src/app/services/http.service.ts");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/checkbox */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/checkbox.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
/* harmony import */ var _code_code_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../code/code.component */ "./src/app/code/code.component.ts");
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/divider */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/form-field.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/select.js");
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/core */ "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/core.js");



















function UnrollComponent_div_13_mat_option_5_Template(rf, ctx) { if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("value", function UnrollComponent_div_13_mat_option_5_Template_mat_option_value_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r4); const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2); return ctx_r3.selectedGates; });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", item_r2.key);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](item_r2.key);
} }
function UnrollComponent_div_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "mat-form-field", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Gates");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "mat-select", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, UnrollComponent_div_13_mat_option_5_Template, 2, 2, "mat-option", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](6, "keyvalue");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](6, 1, ctx_r0.gateMap));
} }
class UnrollComponent {
    constructor(http, data, snackbar) {
        this.http = http;
        this.data = data;
        this.snackbar = snackbar;
        this.selectedGates = [];
        this.gateMap = _services_Operation__WEBPACK_IMPORTED_MODULE_2__["gateMap"];
        this.chooseRigetti = false;
        this.chooseIBMQ = false;
        this.chooseNative = false;
    }
    ngOnInit() {
    }
    deselect() {
        this.chooseIBMQ = false;
        this.chooseRigetti = false;
        this.chooseNative = false;
    }
    unroll() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (!(this.chooseIBMQ || this.chooseNative || this.chooseRigetti)) {
                this.snackbar.open("You must choose to which gates the circuit should be unrolled to.");
                return;
            }
            let option = "";
            if (this.chooseIBMQ) {
                option = "IBMQ";
            }
            else if (this.chooseNative) {
                option = "Custom";
            }
            else if (this.chooseRigetti) {
                option = "Rigetti";
            }
            let object = {
                "option": option,
                "circuit": this.data.circuits["internal"],
                "nativeGates": this.selectedGates
            };
            let circuit = yield this.http.callBackend(object, "unroll");
            if (circuit) {
                this.data.setCircuit("unroll", circuit);
            }
        });
    }
}
UnrollComponent.ɵfac = function UnrollComponent_Factory(t) { return new (t || UnrollComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_http_service__WEBPACK_IMPORTED_MODULE_3__["HttpService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__["MatSnackBar"])); };
UnrollComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: UnrollComponent, selectors: [["app-unroll"]], decls: 25, vars: 5, consts: [[1, "container", "pt-2"], [1, "row", "text-center", "d-flex", "justify-content-center"], [1, "col-4", "d-flex", "justify-content-center", "text-center"], [3, "ngModel", "ngModelChange", "click"], [1, "row"], [1, "col"], ["class", "col", 4, "ngIf"], [1, "row", "text-center", "d-flex", "justify-content-center", "pt-2"], ["mat-mini-fab", "", "matTooltip", "Unroll Circuit.", "matTooltipClass", "tooltip-large", "color", "primary", 1, "float-right", 3, "click"], [1, "container-fluid", "pt-4"], [1, "col", "content-left"], ["circuitRef", "internal"], ["circuitRef", "unroll"], [3, "vertical"], ["appearance", "fill", 1, "multipleSelect"], ["multiple", ""], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"]], template: function UnrollComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "mat-checkbox", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function UnrollComponent_Template_mat_checkbox_ngModelChange_3_listener($event) { return ctx.chooseRigetti = $event; })("click", function UnrollComponent_Template_mat_checkbox_click_3_listener() { return ctx.deselect(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Unroll to native Rigetti gates.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "mat-checkbox", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function UnrollComponent_Template_mat_checkbox_ngModelChange_6_listener($event) { return ctx.chooseIBMQ = $event; })("click", function UnrollComponent_Template_mat_checkbox_click_6_listener() { return ctx.deselect(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Unroll to native IBMQ Experience gates.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "mat-checkbox", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function UnrollComponent_Template_mat_checkbox_ngModelChange_11_listener($event) { return ctx.chooseNative = $event; })("click", function UnrollComponent_Template_mat_checkbox_click_11_listener() { return ctx.deselect(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Choose native gates.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](13, UnrollComponent_div_13_Template, 7, 3, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UnrollComponent_Template_button_click_15_listener() { return ctx.unroll(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "forward");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "app-code", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](23, "app-code", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](24, "mat-divider", 13);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.chooseRigetti);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.chooseIBMQ);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.chooseNative);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.chooseNative);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vertical", true);
    } }, directives: [_angular_material_checkbox__WEBPACK_IMPORTED_MODULE_6__["MatCheckbox"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["NgModel"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], _angular_material_button__WEBPACK_IMPORTED_MODULE_9__["MatButton"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_10__["MatTooltip"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__["MatIcon"], _code_code_component__WEBPACK_IMPORTED_MODULE_12__["CodeComponent"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_13__["MatDivider"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_14__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_14__["MatLabel"], _angular_material_select__WEBPACK_IMPORTED_MODULE_15__["MatSelect"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgForOf"], _angular_material_core__WEBPACK_IMPORTED_MODULE_16__["MatOption"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_8__["KeyValuePipe"]], styles: [".multipleSelect {\n  height: 20px;\n  font-size: 14px;\n  padding: 0px;\n  margin: 0px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NlZWRyaXgvUHJvZ3JhbW1pbmcvUXVhbnR1bVRyYW5zcGlsZXIvZnJvbnRlbmQvc3JjL2FwcC91bnJvbGwvdW5yb2xsLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC91bnJvbGwvdW5yb2xsLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBRUksWUFBQTtFQUNBLGVBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtBQ0FKIiwiZmlsZSI6InNyYy9hcHAvdW5yb2xsL3Vucm9sbC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5tdWx0aXBsZVNlbGVjdCB7XG4gICAgLy8gYmFja2dyb3VuZDogcmVkO1xuICAgIGhlaWdodDogMjBweDtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgcGFkZGluZzogMHB4O1xuICAgIG1hcmdpbjogMHB4O1xuICAgIC8vIC4uLi5cbn0iLCIubXVsdGlwbGVTZWxlY3Qge1xuICBoZWlnaHQ6IDIwcHg7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgcGFkZGluZzogMHB4O1xuICBtYXJnaW46IDBweDtcbn0iXX0= */"], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](UnrollComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-unroll',
                templateUrl: './unroll.component.html',
                styleUrls: ['./unroll.component.scss'],
                encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewEncapsulation"].None
            }]
    }], function () { return [{ type: _services_http_service__WEBPACK_IMPORTED_MODULE_3__["HttpService"] }, { type: _services_data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"] }, { type: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__["MatSnackBar"] }]; }, null); })();


/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false,
    apiUrl: "http://localhost:5000/"
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/seedrix/Programming/QuantumTranspiler/frontend/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main-es2015.js.map