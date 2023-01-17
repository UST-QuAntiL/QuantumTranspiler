import marshmallow as ma
from werkzeug import Response


class CircuitResponse(Response):
    def __init__(self, circuit, **kwargs):
        super().__init__(circuit, mimetype="text/plain", **kwargs)


class DepthResponse:
    def __init__(self, depths: dict):
        self.q_depth = depths.setdefault("q_depth", None)
        self.q_two_qubit = depths.setdefault("q_two_qubit", None)
        self.q_gate_times = depths.setdefault("q_gate_times", None)

        self.r_depth = depths.setdefault("r_depth", None)
        self.r_two_qubit = depths.setdefault("r_two_qubit", None)
        self.r_gate_times = depths.setdefault("r_gate_times", None)

        self.s_depth = depths.setdefault("s_depth", None)
        self.s_two_qubit = depths.setdefault("s_two_qubit", None)
        self.s_gate_times = depths.setdefault("s_gate_times", None)


class DepthResponseSchema(ma.Schema):
    q_depth = ma.fields.Integer()
    q_two_qubit = ma.fields.Integer()
    q_gate_times = ma.fields.Integer()

    r_depth = ma.fields.Integer()
    r_two_qubit = ma.fields.Integer()
    r_gate_times = ma.fields.Integer()

    s_depth = ma.fields.Integer()
    s_two_qubit = ma.fields.Integer()
    s_gate_times = ma.fields.Integer()
