import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const artifactPath = 'C:/Users/j/.gemini/antigravity/brain/af71e119-aa9c-4bdc-b412-ce54c847ecbd/love_app_icon_1782693326268.png';
    const publicDir = path.join(process.cwd(), 'public');

    // 1. Create public directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const icon192Path = path.join(publicDir, 'icon-192.png');
    const icon512Path = path.join(publicDir, 'icon-512.png');

    // 2. Read the generated image
    if (!fs.existsSync(artifactPath)) {
      return NextResponse.json({
        success: false,
        message: 'الملف المصدر للأيقونة غير موجود في المسار المحدد: ' + artifactPath,
      }, { status: 404 });
    }

    const iconBuffer = fs.readFileSync(artifactPath);

    // 3. Write icons to public folder
    fs.writeFileSync(icon192Path, iconBuffer);
    fs.writeFileSync(icon512Path, iconBuffer);

    return NextResponse.json({
      success: true,
      message: 'تم تجهيز أيقونات الـ PWA وحفظها في المجلد العام بنجاح!',
      paths: {
        icon192: icon192Path,
        icon512: icon512Path,
      }
    });
  } catch (error: any) {
    console.error('PWA Icon setup error:', error);
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ أثناء نسخ الأيقونات: ' + error.message,
    }, { status: 500 });
  }
}
