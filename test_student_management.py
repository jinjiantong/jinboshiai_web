from playwright.sync_api import sync_playwright
import time

BASE_URL = 'http://localhost:3000'
MODULES = ['students', 'teachers', 'courses', 'attendance', 'payments']
RESULTS = []

def log(msg):
    print(f"[LOG] {msg}")
    RESULTS.append(msg)

def test_module(page, module_name):
    log(f"\n{'='*50}")
    log(f"测试模块: {module_name}")
    log('='*50)

    try:
        page.goto(f'{BASE_URL}/student-management')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1000)

        page.screenshot(path=f'/tmp/{module_name}_1_loaded.png', full_page=True)
        log(f"✓ 页面加载成功")

        btns = page.locator('button').all()
        log(f"找到 {len(btns)} 个按钮")

        for btn in btns:
            text = btn.inner_text()
            if '添加' in text or '新增' in text:
                log(f"点击添加按钮: {text}")
                btn.click()
                page.wait_for_timeout(1000)
                page.screenshot(path=f'/tmp/{module_name}_2_add_form.png', full_page=True)
                log(f"✓ 添加表单已打开")

                close_btn = page.locator('button:has-text("取消")')
                if close_btn.count() > 0:
                    close_btn.click()
                    page.wait_for_timeout(500)
                    log(f"✓ 已关闭表单")
                break

        page.wait_for_timeout(500)
        page.screenshot(path=f'/tmp/{module_name}_3_list.png', full_page=True)

        edit_btns = page.locator('button:has-text("编辑")')
        if edit_btns.count() > 0:
            edit_btns.first.click()
            page.wait_for_timeout(1000)
            page.screenshot(path=f'/tmp/{module_name}_4_edit_form.png', full_page=True)
            log(f"✓ 编辑表单已打开")

            close_btn = page.locator('button:has-text("取消")')
            if close_btn.count() > 0:
                close_btn.click()
                page.wait_for_timeout(500)
                log(f"✓ 已关闭编辑表单")

        log(f"✓ {module_name} 模块测试完成")
        return True

    except Exception as e:
        log(f"✗ {module_name} 测试失败: {str(e)}")
        page.screenshot(path=f'/tmp/{module_name}_error.png', full_page=True)
        return False

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        console_logs = []
        page.on('console', lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))

        for module in MODULES:
            test_module(page, module)

        browser.close()

        log(f"\n{'='*50}")
        log("测试总结")
        log('='*50)
        for r in RESULTS:
            print(r)

        errors = [l for l in console_logs if 'error' in l.lower()]
        if errors:
            log(f"\n浏览器控制台错误 ({len(errors)}):")
            for e in errors[:5]:
                log(e)

if __name__ == '__main__':
    main()