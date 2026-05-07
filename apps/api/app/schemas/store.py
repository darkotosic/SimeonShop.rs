from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class StoreSettingUpdate(BaseModel):
    value: str | None = None
    value_type: str | None = Field(default=None, max_length=40)
    is_public: bool | None = None


class StoreSettingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    key: str
    value: str | None
    value_type: str
    is_public: bool
    created_at: datetime
    updated_at: datetime
