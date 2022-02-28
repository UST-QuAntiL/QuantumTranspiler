from translation.translators.quil_translator import QuilTranslator
from translation.translators.qsharp_translator import QsharpTranslator
from translation.translators.criq_translator import CirqTranslator
from translation.translators.braket_translator import BraketTranslator
from translation.translators.openqasm_translator import OpenQasmTranslator
from translation.translators.quirk_translator import QuirkTranslator
from translation.translators.translator import Translator


class TranslationHandler():
    translators = []

    def __init__(self):
        self.translators.append(QuilTranslator())
        self.translators.append(QsharpTranslator())
        self.translators.append(CirqTranslator())
        self.translators.append(BraketTranslator())
        self.translators.append(OpenQasmTranslator())
        self.translators.append(QuirkTranslator())

    def translate(self, circuit: str, lg_from: str, lg_to: str) -> str:
        from_translators = [trans for trans in self.translators if trans.name.value == lg_from]
        to_translators = [trans for trans in self.translators if trans.name.value == lg_to]
        if from_translators and to_translators:
            from_translator: Translator = from_translators[0]
            to_translator: Translator = to_translators[0]
            return to_translator.to_language(from_translator.from_language(circuit))
        else:
            raise ValueError("Unsupported translator")
