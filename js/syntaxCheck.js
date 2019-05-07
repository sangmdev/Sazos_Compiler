function clearElements2()
{
    ACC = 0;
    STACK.splice(0,STACK.length);
    VARS.splice(0,VARS.length);
    STDOUT.splice(0,STDOUT.length);
    BRANCHES.splice(0,BRANCHES.length);
    STDIN.splice(0,STDIN.length);
    ERRORS.splice(0, ERRORS.length);
}
function backspaceCheck(editor, event){
    var KeyID = event.keyCode;
    switch(KeyID)
    {
        case 8:
            console.log("backspace pressed");
            clearElements2();
            syntoCheck(editor);
            if(ERRORS.length > 0) {
                document.getElementById("consoleBox").innerHTML = ERRORS.join("\n");
            }
            else{
                document.getElementById("consoleBox").innerHTML = "";
            }
            break;
        case 13:
            console.log("backspace pressed");
            clearElements2();
            syntoCheck(editor);
            if(ERRORS.length > 0) {
                document.getElementById("consoleBox").innerHTML = ERRORS.join("\n");
            }
            else{
                document.getElementById("consoleBox").innerHTML = "";
            }
            break;
        case 46:
            console.log("del pressed");
            clearElements2();
            syntoCheck(editor);
            if(ERRORS.length > 0) {
                document.getElementById("consoleBox").innerHTML = ERRORS.join("\n");
            }
            else{
                document.getElementById("consoleBox").innerHTML = "";
            }
            break;
        default:
            break;
    }
}
function syntoCheck(editor){
    var lineIndex = 0;
    var strline;
    var stopFlag = 0;
    var instructionArray = ["ADD", "BR", "BRNEG", "BRZNEG", "BRPOS", "BRZPOS", "BRZERO", "COPY", "DIV", "MULT", "READ", "WRITE", "STOP","STORE", "SUB", "NOOP","LOAD", "PUSH", "POP", "STACKW", "STACKR"]
    while (lineIndex < editor.lineCount()) {
        strline = editor.getLine(lineIndex).trim().split(/(\s+)/).filter( e => e.trim().length > 0);
        // console.log(strline);
        //Checks that instruction has the correct number of arguments
        var i = 0, j = 0;
        var instructCount = 0;
        //Makes sure label has colon in it
        // for(j = 0; j < 20; j++) {
        //     if (strline[0] == instructionArray[j]) {
        //     }
        // }
        //Makes sure only label has colon in it.
        for(i = 1; i < strline.length; i++){
            if(strline[i].includes(":") === true){
                ERRORS.push("ERROR: '"+strline[i] +"' on line "  + (lineIndex+1) + " should not contain a colon.");
            }
        }
        //Makes sure there is only 1 instruction per line
        for(i = 0; i < strline.length; i++) {
            for (j = 0; j < 20; j++) {
                if (instructionArray[j] === strline[i]) {
                    instructCount++;
                }
            }
        }

        if(instructCount > 1){
            ERRORS.push("ERROR: There is more than one instruction on line " + (lineIndex+1) + ".");
            console.log("ERROR: There is more than one instruction on line " + (lineIndex+1) + ".");
        }
        if(strline[0] === "STOP"){
            stopFlag = 1;
        }
        //Checks that all instructions have correct number of arguments following them.//
        // BIG LIST of 1 arguments
        if(instructCount < 2 && strline[0] !== "STOP"){
            if(strline[0] === "READ" || strline[0] === "ADD" || strline[0] === "LOAD" || strline[0] === "BR" || strline[0] === "BRNEG" || strline[0] == "BRZNEG" || strline[0] == "BRPOS" || strline[0] == "BRZPOS" || strline[0] == "BRZERO" || strline[0] == "DIV" || strline[0] == "MULT" || strline[0] == "READ" || strline[0] == "WRITE" || strline[0] == "STORE" || strline[0] == "SUB" || strline[0] == "LOAD" || strline[0] == "STACKW" || strline[0] == "STACKR"){
                if(stopFlag === 1){
                    ERRORS.push("ERROR: No instructions are allowed below STOP. Line: " + (lineIndex+1));
                }
                if(strline.length === 1 && stopFlag === 0){
                    ERRORS.push("ERROR: Instruction '" + strline[0] + "' on line " + (lineIndex+1) +" requires 1 argument.");
                    console.log("ERROR: Instruction '" + strline[0] + "' on line " + (lineIndex+1) +" requires 1 argument.");
                }
                else if(strline.length > 2 && stopFlag === 0){
                    ERRORS.push("ERROR: Instruction '" + strline[0] + "' on line " + (lineIndex+1) +" received too many arguments.(EXPECTED: 1 argument)");
                    console.log("ERROR: Instruction '" + strline[0] + "' on line " + (lineIndex+1) +" received too many arguments.(EXPECTED: 1 argument)");
                }
            }
            //COPY : 2 arguments
            else if(strline[0] === "COPY"){
                if(stopFlag === 1){
                    ERRORS.push("ERROR: No instructions are allowed below STOP. Line: " + (lineIndex+1));
                }
                if(strline.length < 3 && stopFlag === 0){
                    ERRORS.push("ERROR: Instruction COPY  on line " + (lineIndex+1) +" requires 2 arguments.");
                    console.log("ERROR: Instruction COPY on line " + (lineIndex+1) + " requires 2 arguments.");
                }
                else if(strline.length > 3 && stopFlag === 0){
                    ERRORS.push("ERROR: Instruction COPY  on line " + (lineIndex+1) +" received too many arguments. (EXPECTED: 2 argument)");
                    console.log("ERROR: Instruction COPY  on line " + (lineIndex+1) +" received too many arguments. (EXPECTED: 2 argument)");
                }
            }
            //POP, PUSH, NOOP and STOP : 0 arguments
            else if(strline[0] === "POP" || strline[0] === "PUSH" || strline[0] === "NOOP" || strline[0] === "STOP"){
                if(stopFlag === 1){
                    ERRORS.push("ERROR: No instructions are allowed below STOP. Line: " + (lineIndex+1));
                }
                if(strline.length > 1 && stopFlag === 0){
                    ERRORS.push("ERROR: Instruction '"+ strline[0] + "' on line " + (lineIndex+1) +" should not receive any arguments.");
                    console.log("ERROR: Instruction '"+ strline[0] + "' on line " + (lineIndex+1) +" should not receive any arguments.");
                }
            }
            //LABEL
            else if(strline[0]) {
                if (strline[0].indexOf(":") !== -1 && strline[0].charAt(strline[0].length - 1) === ":") {
                    if (strline[1] === "READ" || strline[1] === "ADD" || strline[1] === "LOAD" || strline[1] === "BR" || strline[1] === "BRNEG" || strline[1] == "BRZNEG" || strline[1] == "BRPOS" || strline[1] == "BRZPOS" || strline[1] == "BRZERO" || strline[1] == "DIV" || strline[1] == "MULT" || strline[1] == "READ" || strline[1] == "WRITE" || strline[1] == "STORE" || strline[1] == "SUB" || strline[1] == "LOAD" || strline[1] == "STACKW" || strline[1] == "STACKR") {
                        if (stopFlag === 1) {
                            ERRORS.push("ERROR: No instructions are allowed below STOP. Line: " + (lineIndex + 1));
                        }
                        if (strline.length === 2 && stopFlag === 0) {
                            ERRORS.push("ERROR: Instruction '" + strline[1] + "' on line " + (lineIndex + 1) + " requires 1 argument.");
                            console.log("ERROR: Instruction '" + strline[1] + "' on line " + (lineIndex + 1) + " requires 1 argument.");
                        } else if (strline.length > 3 && stopFlag === 0) {
                            ERRORS.push("ERROR: Instruction '" + strline[1] + "' on line " + (lineIndex + 1) + " received too many arguments.(EXPECTED: 1 argument)");
                            console.log("ERROR: Instruction '" + strline[1] + "' on line " + (lineIndex + 1) + " received too many arguments.(EXPECTED: 1 argument)");
                        }
                    }
                    //COPY : 2 arguments
                    else if (strline[1] === "COPY") {
                        if (stopFlag === 1) {
                            ERRORS.push("ERROR: No instructions are allowed below STOP. Line: " + (lineIndex + 1));
                        }
                        if (strline.length < 4 && stopFlag === 0) {
                            ERRORS.push("ERROR: Instruction COPY  on line " + (lineIndex + 1) + " requires 2 arguments.");
                            console.log("ERROR: Instruction COPY on line " + (lineIndex + 1) + " requires 2 arguments.");
                        } else if (strline.length > 3 && stopFlag === 0) {
                            ERRORS.push("ERROR: Instruction COPY  on line " + (lineIndex + 1) + " received too many arguments. (EXPECTED: 2 argument)");
                            console.log("ERROR: Instruction COPY  on line " + (lineIndex + 1) + " received too many arguments. (EXPECTED: 2 argument)");
                        }
                    }
                    //POP, PUSH, NOOP and STOP : 0 arguments
                    else if (strline[1] === "POP" || strline[1] === "PUSH" || strline[1] === "NOOP" || strline[1] === "STOP") {
                        if (stopFlag === 1) {
                            ERRORS.push("ERROR: No instructions are allowed below STOP. Line: " + (lineIndex + 1));
                        }
                        if (strline.length > 2 && stopFlag === 0) {
                            ERRORS.push("ERROR: Instruction '" + strline[1] + "' on line " + (lineIndex + 1) + " should not receive any arguments.");
                            console.log("ERROR: Instruction '" + strline[1] + "' on line " + (lineIndex + 1) + " should not receive any arguments.");
                        }
                    }
                } else if (stopFlag === 1) {
                   if(!strline[1]){
                       ERRORS.push("ERROR: Variable "+ strline[0] + " on line: " + (lineIndex+1) +" is not initialized.");
                   }
                }
                else if(stopFlag === 0) {
                    ERRORS.push("ERROR: Unexpected " + strline[0] +"' on line " +(lineIndex+1));
                }
                else{
                    //Do nothing
                }
            }
        }
        lineIndex++;
    }
    if(ERRORS.length > 0) {
        syntaxCheckFlag=1;
    }
    else{
        syntaxCheckFlag=0;
    }

}