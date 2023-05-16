import marshmallow as ma


class ImportRequest:
    def __init__(self, option, circuit):
        self.option = option
        self.circuit = circuit


class ExportRequest:
    def __init__(self, option, circuit):
        self.option = option
        self.circuit = circuit


class ConversionRequest:
    def __init__(self, option, output_option, circuit):
        self.option = option
        self.output_option = output_option
        self.circuit = circuit


class UnrollRequest:
    def __init__(self, option, circuit, is_expert, format):
        self.option = option
        self.circuit = circuit
        self.is_expert = is_expert
        self.format = format


class SimulationRequest:
    def __init__(self, circuit):
        self.circuit = circuit


class DepthRequest:
    def __init__(self, circuit):
        self.circuit = circuit


class ImportRequestSchema(ma.Schema):
    option = ma.fields.String()
    circuit = ma.fields.String()


class ExportRequestSchema(ma.Schema):
    option = ma.fields.String()
    circuit = ma.fields.String()


class ConversionRequestSchema(ma.Schema):
    option = ma.fields.String()
    output_option = ma.fields.String(data_key="optionOutput")
    circuit = ma.fields.String()


class UnrollRequestSchema(ma.Schema):
    option = ma.fields.String()
    circuit = ma.fields.String()
    is_expert = ma.fields.Boolean(data_key="isExpert")
    format = ma.fields.String()


class SimulationRequestSchema(ma.Schema):
    circuit = ma.fields.String()


class DepthRequestSchema(ma.Schema):
    circuit = ma.fields.String()
