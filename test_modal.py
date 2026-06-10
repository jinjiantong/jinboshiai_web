from playwright.sync_api import sync_playwright

BASE_URL = 'http://localhost:3000'

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        errors = []
        page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)

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

        modal_visible = page.locator('.fixed.inset-0.bg-black\\/50').is_visible()
        print(f"模态框是否可见: {modal_visible}")

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
        print(f"提交后模态框是否可见: {modal_visible_after}")

        if modal_visible_after:
            print("❌ 模态框没有关闭！这是bug")
        else:
            print("✓ 模态框已关闭")

        page.screenshot(path='/tmp/modal_test.png', full_page=True)
        print("截图已保存")

        browser.close()

if __name__ == '__main__':
    main()