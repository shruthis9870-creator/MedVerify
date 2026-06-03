from app.flows.base import BaseFlow
from app.flows.doctor_flow import DoctorFlow
from app.flows.emergency_flow import EmergencyFlow
from app.flows.report_flow import ReportFlow
from app.flows.start_flow import StartFlow
from app.flows.symptom_flow import SymptomFlow
from app.flows.emergency_flow import EmergencyFlow


class FlowRegistry:
    def __init__(self) -> None:
        self.flows: dict[str, BaseFlow] = {
            "start": StartFlow(),
            "symptoms": SymptomFlow(),
            "report": ReportFlow(),
            "doctor": DoctorFlow(),
            "emergency": EmergencyFlow(),
        }

    def get(self, flow_name: str) -> BaseFlow:
        return self.flows.get(flow_name, self.flows["start"])