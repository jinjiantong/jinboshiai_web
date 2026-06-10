from playwright.sync_api import sync_playwright
import json

BASE_URL = 'http://localhost:3000'
MODULES = ['students', 'teachers', 'courses']
RESULTS = []
ISSUES = []

def log(msg):
    print(f"[LOG] {msg}")
    RESULTS.append(msg)

def report_issue(msg):
    print(f"[ISSUE] {msg}")
    ISSUES.append(msg)

def test_module_detail(page, module_name):
    log(f"\n{'='*60}")
    log(f"详细测试模块: {module_name}")
    log('='*60)

    try:
        page.goto(f'{BASE_URL}/student-management')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(2000)

        page.screenshot(path=f'/tmp/{module_name}_1_main.png', full_page=True)

        nav_items = page.locator('button').all()
        module_found = False
        for item in nav_items:
            text = item.inner_text()
            if module_name.lower() in text.lower():
                log(f"找到模块按钮: {text}")
                item.click()
                page.wait_for_timeout(1500)
                module_found = True
                break

        if not module_found:
            report_issue(f"{module_name}: 未找到模块切换按钮")

        page.screenshot(path=f'/tmp/{module_name}_2_switched.png', full_page=True)

        add_btn = page.locator('button:has-text("添加")').first
        if add_btn.count() > 0:
            log(f"点击添加按钮")
            add_btn.click()
            page.wait_for_timeout(1000)
            page.screenshot(path=f'/tmp/{module_name}_3_add_form.png', full_page=True)

            form_inputs = page.locator('input').all()
            log(f"表单输入框数量: {len(form_inputs)}")

            if len(form_inputs) > 0:
                log(f"尝试填写表单...")
                for inp in form_inputs[:2]:
                    try:
                        inp.fill('测试数据')
                        log(f"✓ 填写了输入框")
                    except:
                        pass

                submit_btn = page.locator('button:has-text("保存")')
                if submit_btn.count() > 0:
                    log(f"点击保存按钮")
                    submit_btn.click()
                    page.wait_for_timeout(2000)
                    page.screenshot(path=f'/tmp/{module_name}_4_after_save.png', full_page=True)
                else:
                    report_issue(f"{module_name}: 未找到保存按钮")

            cancel_btn = page.locator('button:has-text("取消")')
            if cancel_btn.count() > 0:
                cancel_btn.click()
                page.wait_for_timeout(500)

        edit_btns = page.locator('button:has-text("编辑")')
        if edit_btns.count() > 0:
            log(f"找到编辑按钮，点击")
            edit_btns.first.click()
            page.wait_for_timeout(1000)
            page.screenshot(path=f'/tmp/{module_name}_5_edit_form.png', full_page=True)

            cancel_btn = page.locator('button:has-text("取消")')
            if cancel_btn.count() > 0:
                cancel_btn.click()
                page.wait_for_timeout(500)

        log(f"✓ {module_name} 模块测试完成")

    except Exception as e:
        log(f"✗ {module_name} 测试失败: {str(e)}")
        page.screenshot(path=f'/tmp/{module_name}_error.png', full_page=True)
        report_issue(f"{module_name}: 测试异常 - {str(e)}")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        console_msgs = []
        page.on('console', lambda msg: console_msgs.append(f"[{msg.type}] {msg.text}"))
        page.on('requestfailed', lambda req: report_issue(f"请求失败: {req.url}"))

        for module in MODULES:
            test_module_detail(page, module)

        browser.close()

        log(f"\n{'='*60}")
        log("测试结果总结")
        log('='*60)
        for r in RESULTS:
            print(r)

        if ISSUES:
            log(f"\n发现的问题 ({len(ISSUES)}):")
            for issue in ISSUES:
                print(f"  - {issue}")

        errors = [m for m in console_msgs if 'error' in m.lower()]
        if errors:
            log(f"\n浏览器控制台错误 ({len(errors)}):")
            for e in errors[:10]:
                log(e)

if __name__ == '__main__':
    main()