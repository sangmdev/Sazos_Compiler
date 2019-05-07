var ACC = 0;
var STACK = new Array();
var VARS = new Array();
var STDOUT = new Array();
var BRANCHES = new Array();
var STDIN = new Array();
var ERRORS = new Array();
var STACKSIZE = 1000;

function addVar(variable)
{
    var item = {name: variable[0], value: parseInt(variable[1])};

    if(isNaN(item.name) === false || isNaN(item.name[0]) === false)
    {
        ERRORS.push("Variable '" + item.name + "' should not start with a number (line " + (lineIndex + 1) + ").");
        return;
    }

    for(var i = 0; i < VARS.length; i++)
    {
        if(VARS[i].name === item.name)
        {
            VARS[i].value = item.value;
            return;
        }
    }
    VARS.push(item);
    console.log(item);
}

function getVar(match)
{
    for(var i = 0; i < VARS.length; i++)
    {
        if(match === VARS[i].name)
        {
            return VARS[i];
        }
    }

    return -1;
}

function addBranchLabel(line, linenumber)
{
    var label = line[0];
    var branchItem = {branchLabel:"", branchValue: 0};
    if(label.charAt(label.length - 1) === ':')
    {
        branchItem.branchLabel = label.substring(0,label.length - 1);
        branchItem.branchValue = linenumber;
        BRANCHES.push(branchItem);
    }
    else
    {
        return -1;
    }
}

function getBranchLabel(label)
{
    for(var i = 0; i < BRANCHES.length; i++)
    {
        if(label === BRANCHES[i].branchLabel)
        {
            return BRANCHES[i];
        }
    }
    return -1;
}

function parseFunction(line)
{
    var funcName = line[0], funcParamA = line[1], funcParamB = line[2];
    /*if(isNumeric(funcParamA))
    {
        funcParamA = parseInt(funcParamA);
    }
    else if(!(!funcParamA || funcParamA === 0))
    {
        funcParamA = getVar(funcParamA);
    }
    if(isNumeric(funcParamB))
    {
        funcParamB = parseInt(funcParamB);
    }
    else if(!(!funcParamB || funcParamB === 0))
    {
        funcParamB = getVar(funcParamB);
    }*/
    switch (funcName)
    {
        case "ADD":
            ADD(funcParamA);
            break;
        case "SUB":
            SUB(funcParamA);
            break;
        case "MULT":
            MULT(funcParamA);
            break;
        case "DIV":
            DIV(funcParamA);
            break;
        case "LOAD":
            LOAD(funcParamA);
            break;
        case "STORE":
            STORE(funcParamA);
            break;
        case "COPY":
            COPY(funcParamA, funcParamB);
            break;
        case "READ":
            READ(funcParamA);
            break;
        case "WRITE":
            WRITE(funcParamA);
            break;
        case "STOP":
            STOP();
            break;
        case "NOOP":
            NOOP();
            break;
        case "BR":
            BR(funcParamA);
            break;
        case "BRNEG":
            BRNEG(funcParamA);
            break;
        case "BRZNEG":
            BRZNEG(funcParamA);
            break;
        case "BRPOS":
            BRPOS(funcParamA);
            break;
        case "BRZPOS":
            BRZPOS(funcParamA);
            break;
        case "BRZERO":
            BRZERO(funcParamA);
            break;
        case "PUSH":
            PUSH();
            break;
        case "POP":
            POP();
            break;
        case "STACKW":
            STACKW(funcParamA);
            break;
        case "STACKR":
            STACKR(funcParamA);
            break;
        default:
            error();
            break;
    }
}

function clearElements()
{
    ACC = 0;
    STACK.splice(0,STACK.length);
    VARS.splice(0,VARS.length);
    STDOUT.splice(0,STDOUT.length);
    BRANCHES.splice(0,BRANCHES.length);
    STDIN.splice(0,STDIN.length);
    ERRORS.splice(0, ERRORS.length);
}

function getInput(input)
{
    STDIN = input.trim().split(/(\s+)/).filter( e => e.trim().length > 0);
}
function ADD(a)
{
    var num;
    if(isNaN(a) === false)
    {
        num = parseInt(a);
    }
    else if(!(!a.trim() || a.length === 0))
    {
        if(getVar(a) !== -1)
            num = getVar(a).value;
        else
        {
            ERRORS.push("Variable with identifier '" + a + "' has not been created (line " + (lineIndex + 1) +").");
            return;
        }
    }

    ACC += parseInt(num);
}

function SUB(a)
{
    var num;
    if(isNaN(a) === false)
    {
        num = parseInt(a);
    }
    else if(!(!a.trim() || a.length === 0))
    {
        if(getVar(a) !== -1)
            num = getVar(a).value;
        else
        {
            ERRORS.push("Variable with identifier '" + a + "' has not been created (line " + (lineIndex + 1) +").");
            return;
        }
    }

    ACC -= parseInt(num);
}

function MULT(a)
{
    var num;
    if(isNaN(a) === false)
    {
        num = parseInt(a);
    }
    else if(!(!a.trim() || a.length === 0))
    {
        if(getVar(a) !== -1)
            num = getVar(a).value;
        else
        {
            ERRORS.push("Variable with identifier '" + a + "' has not been created (line " + (lineIndex + 1) +").");
            return;
        }
    }

    ACC *= parseInt(num);
}

function DIV(a)
{
    var num;
    if(isNaN(a) === false)
    {
        num = parseInt(a);
    }
    else if(!(!a.trim() || a.length === 0))
    {
        if(getVar(a) !== -1)
            num = getVar(a).value;
        else
        {
            ERRORS.push("Variable with identifier '" + a + "' has not been created (line " + (lineIndex + 1) +").");
            return;
        }
    }

    if(parseInt(num) === 0)
    {
        ERRORS.push("Argument '" + a + "' will cause division by zero (line " + (lineIndex + 1) +").");
        return;
    }

    ACC = parseInt(ACC/num);
}

function LOAD(a)
{
    var num;
    if(isNaN(a) === false)
    {
        num = parseInt(a);
    }
    else if(!(!a.trim() || a.length === 0))
    {
        if(getVar(a) !== -1)
            num = getVar(a).value;
        else
        {
            ERRORS.push("Variable with identifier '" + a + "' has not been created (line " + (lineIndex + 1) +").");
            return;
        }
    }

    ACC = parseInt(num);
}

function STORE(a)
{
    if(isNaN(a[0]) === false)
    {
        ERRORS.push("Instruction argument '" + a + "' must be a proper variable (line " + (lineIndex + 1) +").");
        return;
    }
    else if(!(!a.trim() || a.length === 0))
    {
        if(getVar(a) === -1)
        {
            ERRORS.push("Variable with identifier '" + a + "' has not been created (line " + (lineIndex + 1) +").");
            return;
        }
    }
    var variable = new Array();
    variable[0] = a;
    variable[1] = ACC;
    addVar(variable);
}

function COPY(a, b)
{
    if(isNaN(a[0]) === false)
    {
        ERRORS.push("Instruction argument '" + a + "' must be a proper variable (line " + (lineIndex + 1) +").");
        return;
    }
    else if(!(!a.trim() || a.length === 0))
    {
        if(getVar(a) === -1)
        {
            ERRORS.push("Variable with identifier '" + a + "' has not been created (line " + (lineIndex + 1) +").");
            return;
        }
    }
    if(isNaN(b[0]) === false)
    {
        ERRORS.push("Instruction argument '" + b + "' must be a proper variable (line " + (lineIndex + 1) +").");
        return;
    }
    else if(!(!b.trim() || b.length === 0))
    {
        if(getVar(b) === -1)
        {
            ERRORS.push("Variable with identifier '" + b + "' has not been created (line " + (lineIndex + 1) +").");
            return;
        }
    }
    var variable = new Array();
    variable[0] = a;
    variable[1] = getVar(b).value;
    addVar(variable);
}

function READ(a)
{
    if(isNaN(a) === false)
    {
        ERRORS.push("Instruction argument '" + a + "' must be a proper variable (line " + (lineIndex + 1) +").");
        return;
    }
    else if(!(!a.trim() || a.length === 0))
    {
        if(getVar(a) === -1)
        {
            ERRORS.push("Variable with identifier '" + a + "' has not been created (line " + (lineIndex + 1) +").");
            return;
        }
    }

    if(STDIN.length === 0)
    {
        ERRORS.push("Cannot read into variable '" + a + "' as there isn't sufficient input (line " + (lineIndex + 1) +").");
        return;
    }
    if(isNaN(STDIN[0]) === true)
    {
        ERRORS.push("Cannot read into '" + a + "' as the input '" + STDIN[0] + "' is not a number (line " + (lineIndex + 1) +").");
        return;
    }
    var variable = new Array();
    variable.push(a);
    variable.push(STDIN[0]);
    addVar(variable);
    STDIN.splice(0,1);
}

function WRITE(a)
{
    var item;
    if(isNaN(a) === false)
    {
        item = parseInt(a);
    }
    else if(!(!a.trim() || a.length === 0))
    {
        if(getVar(a) !== -1)
            item = getVar(a).value;
        else
        {
            ERRORS.push("Variable with identifier '" + a + "' has not been created (line " + (lineIndex + 1) +").");
            return;
        }
    }
    STDOUT.push(item.toString());
}

function STOP()
{
    return;
}

function NOOP()
{
    return; //literally nothing
}

function BR(a)
{
    if(getBranchLabel(a) === -1)
    {
        ERRORS.push("'" + a + "' is not a branch label (line " + (lineIndex + 1) +").");
        return;
    }
    labelIndex = getBranchLabel(a).branchValue;
}

function BRNEG(a)
{
    if(getBranchLabel(a) === -1)
    {
        ERRORS.push("'" + a + "' is not a branch label (line " + (lineIndex + 1) +").");
        return;
    }
    if(ACC < 0)
        labelIndex = getBranchLabel(a).branchValue;
}

function BRZNEG(a)
{
    if(getBranchLabel(a) === -1)
    {
        ERRORS.push("'" + a + "' is not a branch label (line " + (lineIndex + 1) +").");
        return;
    }
    if(ACC <= 0)
        labelIndex = getBranchLabel(a).branchValue;
}

function BRPOS(a)
{
    if(getBranchLabel(a) === -1)
    {
        ERRORS.push("'" + a + "' is not a branch label (line " + (lineIndex + 1) +").");
        return;
    }
    if(ACC > 0)
        labelIndex = getBranchLabel(a).branchValue;
}

function BRZPOS(a)
{
    if(getBranchLabel(a) === -1)
    {
        ERRORS.push("'" + a + "' is not a branch label (line " + (lineIndex + 1) +").");
        return;
    }
    if(ACC >= 0)
        labelIndex = getBranchLabel(a).branchValue;
}

function BRZERO(a)
{
    if(getBranchLabel(a) === -1)
    {
        ERRORS.push("'" + a + "' is not a branch label (line " + (lineIndex + 1) +").");
        return;
    }
    if(ACC === 0)
        labelIndex = getBranchLabel(a).branchValue;
}

function PUSH()
{
    if(STACK.length === STACKSIZE)
    {
        ERRORS.push("Stack overflow: Cannot push as the stack reached its size limit of " + STACKSIZE + " (line " + (lineIndex + 1) +").");
        return;
    }
    STACK.push(0);
}

function POP()
{
    if(STACK.length === 0)
    {
        ERRORS.push("Stack underflow: Cannot pop an empty stack (line " + (lineIndex + 1) +").");
        return;
    }
    STACK.pop();
}

function STACKW(a)
{
    var location;

    if(isNaN(a) === false)
    {
        location = STACK.length - 1 - parseInt(a);

        if(location > -1 && location < STACK.length)
        {
            STACK[location] = ACC;
        }
        else
        {
            ERRORS.push("Cannot write to stack as the position '" + a + "' down the stack is not allocated (line " + (lineIndex + 1) +").");
            return;
        }
    }
}

function STACKR(a)
{
    var location;

    if(isNaN(a) === false)
    {
        location = STACK.length - 1 - parseInt(a);

        if(location > -1 && location < STACK.length)
        {
            ACC = STACK[location];
        }
        else
        {
            ERRORS.push("Cannot read from stack as the position '" + a + "' down the stack is not allocated (line " + (lineIndex + 1) +").");
            return;
        }
    }
}