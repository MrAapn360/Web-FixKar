<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="margin:0; padding:0; background:#f4f6fb; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb; padding: 32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; padding: 32px; box-shadow: 0 2px 10px rgba(16,21,40,0.06);">
                    <tr>
                        <td align="center" style="padding-bottom: 16px;">
                            <span style="font-size: 22px; font-weight: 800; color: #1f2a5c;">Fix<span style="color:#3355f5;">Kar</span></span>
                        </td>
                    </tr>
                    <tr>
                        <td style="color:#1f2a3a; font-size:16px; line-height:1.5;">
                            <p>Hi {{ $fullName }},</p>
                            <p>Use the code below to verify your email address. It expires in 10 minutes.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 24px 0;">
                            <span style="display:inline-block; font-size:32px; font-weight:800; letter-spacing:8px; color:#3355f5; background:#eef1ff; padding:14px 24px; border-radius:10px;">
                                {{ $code }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style="color:#8a93a6; font-size:13px; line-height:1.5;">
                            <p>If you didn't request this, you can safely ignore this email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
