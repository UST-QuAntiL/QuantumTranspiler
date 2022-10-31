def create_param_string(params, param_str=""):
    for param in params:
        if param_str != "":
            param_str += ", "
        param_str += f"{param}"
    return param_str


def create_reg_string(regs, param_str, simple_registers):
    for bit in regs:
        if param_str != "":
            param_str += ", "
        if simple_registers:
            param_str += f"{bit.index}"
        else:
            param_str += f"{bit.register.name}[{bit.index}]"
    return param_str


def create_matrix_params(params):
    params = params[0]
    matrix_str = f"np.{repr(params)}"
    return matrix_str


def create_matrix(matrix):
    matrix_str = f"np.{repr(matrix)}"
    return matrix_str
