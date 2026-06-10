from playwright.sync_api import sync_playwright

BASE_URL = 'http://localhost:3000'

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        console_logs = []
        page.on('console', lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
        page.on('pageerror', lambda err: console_logs.append(f"[pageerror] {err}"))

        print("访问师生管理系统...")
        page.goto(f'{BASE_URL}/student-management')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(3000)

        print("点击学员档案模块...")
        page.locator('button:has-text("学员档案")').first.click()
        page.wait_for_timeout(2000)

        print("点击添加按钮...")
        add_btns = page.locator('button:has-text("添加")').all()
        print(f"找到 {len(add_btns)} 个添加按钮")
        if len(add_btns) > 0:
            add_btns[0].click()
        page.wait_for_timeout(2000)

        inputs = page.locator('input:visible').all()
        print(f"找到 {len(inputs)} 个输入框")
        if len(inputs) > 0:
            print(f"填写表单...")
            # 使用 type 而不是 fill
            inputs[0].type("自动化测试")
            print("✓ 填写完成")

        print("点击提交按钮...")
        submit_btn = page.locator('button[type="submit"]')
        if submit_btn.count() > 0:
            submit_btn.click()
            print("已点击提交按钮")
        else:
            print("✗ 提交按钮不存在")

        page.wait_for_timeout(5000)

        modal_visible_after = page.locator('.fixed.inset-0.bg-black\\/50').is_visible()
        print(f"\n提交后模态框是否可见: {modal_visible_after}")

        if modal_visible_after:
            print("❌ 模态框没有关闭！这是bug")
        else:
            print("✓ 模态框已关闭")

        print("\n浏览器控制台日志:")
        for log in console_logs:
            if 'handleSubmit' in log or '模态框' in log or 'formData' in log or '响应' in log:
                print(f"  {log}")

        browser.close()

if __name__ == '__main__':
    main()