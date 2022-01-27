from enum import Enum


class TranslatorNames(Enum):
    BRAKET = "braket_translator"
    CIRQ = "cirq_translator"
    QSHARP = "qsharp_translator"
    QUIL = "quil_translator"
    OPENQASM = "openqasm_translator"