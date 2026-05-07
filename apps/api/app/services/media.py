from urllib.parse import urlparse

from app.core.config import settings

BLOCKED_SCHEMES = {"javascript", "data", "file"}


def get_media_provider() -> str:
    return settings.MEDIA_PROVIDER


def validate_image_url(image_url: str) -> str:
    value = image_url.strip()
    parsed = urlparse(value)
    if parsed.scheme.lower() in BLOCKED_SCHEMES:
        raise ValueError("Image URL scheme is not allowed.")
    if settings.APP_ENV.lower() == "production" and parsed.scheme.lower() != "https":
        raise ValueError("Image URL must use https in production.")
    if parsed.scheme.lower() not in {"http", "https"} or not parsed.netloc:
        raise ValueError("Image URL must be an absolute HTTP(S) URL.")
    return value


def create_signed_upload_placeholder() -> None:
    raise NotImplementedError("Signed uploads will be implemented after Cloudinary or R2 is selected.")
