from playwright.sync_api import sync_playwright

BASE_URL = 'http://localhost:3000'

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        console_logs = []
        page.on('console', lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))

        print("访问师生管理系统...")
        page.goto(f'{BASE_URL}/student-management')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(3000)

        print("点击学员档案模块...")
        page.locator('button:has-text("学员档案")').first.click()
        page.wait_for_timeout(2000)

        print("点击添加按钮...")
        page.locator('button:has-text("添加")').first.click()
        page.wait_for_timeout(2000)

        inputs = page.locator('input:visible').all()
        if len(inputs) > 0:
            print(f"填写表单...")
            inputs[0].fill("自动化测试")
            print("✓ 填写完成")

        print("点击提交按钮...")
        submit_btn = page.locator('button[type="submit"]')
        submit_btn.click()
        page.wait_for_timeout(3000)

        modal_visible_after = page.locator('.fixed.inset-0.bg-black\\/50').is_visible()
        print(f"\n提交后模态框是否可见: {modal_visible_after}")

        print("\n浏览器控制台日志:")
        for log in console_logs:
            if 'modal' in log.lower() or '关闭' in log or 'submit' in log.lower() or '响应' in log:
                print(f"  {log}")

        browser.close()

if __name__ == '__main__':
    main()