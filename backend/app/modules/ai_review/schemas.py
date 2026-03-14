from pydantic import BaseModel, Field, field_validator, model_validator
from typing import List, Optional, Any

class AIReviewRequest(BaseModel):
    application_id: int

class AIDocumentIssue(BaseModel):
    document_type: str = Field(description="The type of document that has an issue")
    issue: str = Field(description="Description of the problem found")
    recommendation: str = Field(description="How the user should fix this issue")

    @model_validator(mode='before')
    @classmethod
    def normalize_issue(cls, data: Any) -> Any:
        if isinstance(data, dict):
            # Map 'document' -> 'document_type'
            if 'document_type' not in data and 'document' in data:
                data['document_type'] = str(data['document'])
            if 'document_type' not in data:
                data['document_type'] = "Unknown Document"
                
            # Map 'issues' -> 'issue'
            if 'issue' not in data and 'issues' in data:
                issues = data['issues']
                data['issue'] = " ".join([str(i) for i in issues]) if isinstance(issues, list) else str(issues)
            if 'issue' not in data:
                data['issue'] = "Issue reported during automated review."
                
            # Map 'recommendations' -> 'recommendation'
            if 'recommendation' not in data and 'recommendations' in data:
                recs = data['recommendations']
                data['recommendation'] = " ".join([str(r) for r in recs]) if isinstance(recs, list) else str(recs)
            # Sometimes it uses 'solution' or 'fix'
            if 'recommendation' not in data and 'solution' in data:
                data['recommendation'] = str(data['solution'])
            if 'recommendation' not in data:
                data['recommendation'] = "Please review and correct the document."
        return data

class AIReviewSummary(BaseModel):
    missing_documents: List[str] = Field(default_factory=list, description="List of required documents that are completely missing")
    document_issues: List[AIDocumentIssue] = Field(default_factory=list, description="List of issues found in the uploaded documents")
    general_recommendations: List[str] = Field(default_factory=list, description="Overall recommendations for the applicant")

    @field_validator('general_recommendations', mode='before')
    @classmethod
    def parse_recommendations(cls, v: Any) -> List[str]:
        if isinstance(v, list):
            res = []
            for item in v:
                if isinstance(item, str):
                    res.append(item)
                elif isinstance(item, dict):
                    # extract and combine all string values from the dict (e.g., {"step": "...", "description": "..."})
                    values = [str(val) for val in item.values() if val]
                    if values:
                        res.append(" - ".join(values))
            return res
        return v

class ValidationResult(BaseModel):
    missing_documents: List[str] = Field(default_factory=list)
    invalid_files: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
