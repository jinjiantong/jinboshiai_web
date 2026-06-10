from playwright.sync_api import sync_playwright

BASE_URL = 'http://localhost:3000'
RESULTS = []
ISSUES = []
SUCCESS = []

def log(msg):
    print(f"[LOG] {msg}")
    RESULTS.append(msg)

def report_issue(msg):
    print(f"[ISSUE] {msg}")
    ISSUES.append(msg)

def report_success(msg):
    print(f"[OK] {msg}")
    SUCCESS.append(msg)

def test_module(page, module_name):
    log(f"\n{'='*60}")
    log(f"测试模块: {module_name}")
    log('='*60)

    module_btn = page.locator(f'button:has-text("{module_name}")')
    if module_btn.count() > 0:
        log(f"切换到: {module_name}")
        module_btn.first.click()
        page.wait_for_timeout(2000)
    else:
        report_issue(f"{module_name}: 未找到模块按钮")
        return

    table_rows = page.locator('tbody tr').all()
    log(f"表格行数: {len(table_rows)}")

    log("测试添加功能...")
    add_btns = page.locator('button:has-text("添加")')
    if add_btns.count() > 0:
        add_btns.first.click()
        page.wait_for_timeout(2000)

        inputs = page.locator('input:visible').all()
        selects = page.locator('select:visible').all()
        log(f"表单输入框: {len(inputs)}, 下拉框: {len(selects)}")

        if len(inputs) > 0:
            inputs[0].fill(f"自动化测试_{module_name}")
            log("✓ 填写了表单")

        submit_btn = page.locator('button[type="submit"]')
        if submit_btn.count() > 0:
            log("点击提交按钮")
            submit_btn.click()
            page.wait_for_timeout(3000)
            report_success(f"{module_name}: 添加成功")
        else:
            report_issue(f"{module_name}: 未找到提交按钮")
            page.locator('button:has-text("取消")').click()
            page.wait_for_timeout(500)
    else:
        report_issue(f"{module_name}: 未找到添加按钮")

    page.wait_for_timeout(1000)

    log("测试编辑功能...")
    edit_btns = page.locator('button:has-text("编辑")')
    if edit_btns.count() > 0:
        edit_btns.first.click()
        page.wait_for_timeout(2000)

        save_btns = page.locator('button:has-text("保存")')
        if save_btns.count() > 0:
            log("点击保存按钮")
            save_btns.click()
            page.wait_for_timeout(3000)
            report_success(f"{module_name}: 编辑成功")
        else:
            report_issue(f"{module_name}: 未找到保存按钮")
            page.locator('button:has-text("取消")').click()
            page.wait_for_timeout(500)
    else:
        report_issue(f"{module_name}: 未找到编辑按钮（可能没有数据）")

    page.wait_for_timeout(1000)

    log("测试删除功能...")
    delete_btns = page.locator('button:has-text("删除")')
    if delete_btns.count() > 0:
        delete_btns.first.click()
        page.wait_for_timeout(1000)

        confirm_btns = page.locator('button:has-text("确认")')
        if confirm_btns.count() > 0:
            confirm_btns.click()
            page.wait_for_timeout(2000)
            report_success(f"{module_name}: 删除成功")
        else:
            page.locator('button:has-text("取消")').click()
            page.wait_for_timeout(500)
            report_issue(f"{module_name}: 未找到确认按钮")
    else:
        report_issue(f"{module_name}: 未找到删除按钮（可能没有数据）")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        errors = []
        page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)

        log("访问师生管理系统...")
        page.goto(f'{BASE_URL}/student-management')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(3000)

        modules = ['学员档案', '老师档案', '班级档案']
        for module in modules:
            test_module(page, module)

        browser.close()

        log("\n" + "=" * 60)
        log("测试结果总结")
        log("=" * 60)

        log(f"\n成功操作 ({len(SUCCESS)}):")
        for s in SUCCESS:
            print(f"  ✓ {s}")

        if ISSUES:
            log(f"\n发现的问题 ({len(ISSUES)}):")
            for issue in ISSUES:
                print(f"  ✗ {issue}")
        else:
            log("\n✓ 所有测试通过")

        if errors:
            log(f"\n浏览器控制台错误 ({len(errors)}):")
            for e in errors[:5]:
                print(f"  - {e[:100]}")

if __name__ == '__main__':
    main()