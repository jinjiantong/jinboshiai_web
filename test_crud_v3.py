from playwright.sync_api import sync_playwright

BASE_URL = 'http://localhost:3000'
RESULTS = []
ISSUES = []

def log(msg):
    print(f"[LOG] {msg}")
    RESULTS.append(msg)

def report_issue(msg):
    print(f"[ISSUE] {msg}")
    ISSUES.append(msg)

def discover_form(page):
    log("检查表单内容...")

    all_btns = page.locator('button').all()
    log(f"页面按钮 ({len(all_btns)}):")
    for btn in all_btns:
        try:
            text = btn.inner_text()
            log(f"  - [{text}]")
        except:
            pass

    inputs = page.locator('input:visible').all()
    log(f"可见输入框: {len(inputs)}")

    selects = page.locator('select:visible').all()
    log(f"可见下拉框: {len(selects)}")

    page.screenshot(path='/tmp/form_detail.png', full_page=True)

def test_module(page, module_name):
    log(f"\n{'='*60}")
    log(f"测试模块: {module_name}")
    log('='*60)

    module_btn = page.locator(f'button:has-text("{module_name}")')
    if module_btn.count() > 0:
        log(f"切换到: {module_name}")
        module_btn.first.click()
        page.wait_for_timeout(2000)
        page.screenshot(path=f'/tmp/{module_name}_1.png', full_page=True)
    else:
        report_issue(f"{module_name}: 未找到模块按钮")

    add_btns = page.locator('button:has-text("添加")')
    if add_btns.count() > 0:
        log(f"点击添加按钮")
        add_btns.first.click()
        page.wait_for_timeout(2000)
        page.screenshot(path=f'/tmp/{module_name}_2_add_form.png', full_page=True)

        discover_form(page)

        inputs = page.locator('input:visible').all()
        if len(inputs) > 0:
            try:
                inputs[0].fill(f"测试_{module_name}")
                log("✓ 填写了第一个输入框")
            except Exception as e:
                report_issue(f"{module_name}: 填写输入框失败")

        submit_btns = page.locator('button:has-text("保存")')
        if submit_btns.count() > 0:
            log("点击保存按钮")
            submit_btns.click()
            page.wait_for_timeout(3000)
            page.screenshot(path=f'/tmp/{module_name}_3_after_save.png', full_page=True)
            log("✓ 保存操作完成")
        else:
            report_issue(f"{module_name}: 未找到保存按钮，查找其他按钮")
            for btn in page.locator('button:visible').all():
                try:
                    text = btn.inner_text()
                    if text in ['添加', '取消', '关闭']:
                        log(f"  发现按钮: [{text}]")
                except:
                    pass

            cancel_btns = page.locator('button:has-text("取消")')
            if cancel_btns.count() > 0:
                cancel_btns.click()
                page.wait_for_timeout(500)
    else:
        report_issue(f"{module_name}: 未找到添加按钮")

    page.wait_for_timeout(1000)

    edit_btns = page.locator('button:has-text("编辑")')
    if edit_btns.count() > 0:
        log(f"点击编辑按钮")
        edit_btns.first.click()
        page.wait_for_timeout(2000)
        page.screenshot(path=f'/tmp/{module_name}_4_edit_form.png', full_page=True)

        discover_form(page)

        cancel_btns = page.locator('button:has-text("取消")')
        if cancel_btns.count() > 0:
            cancel_btns.click()
            page.wait_for_timeout(500)
            log("✓ 已关闭编辑表单")
    else:
        report_issue(f"{module_name}: 未找到编辑按钮")

    page.wait_for_timeout(1000)

    delete_btns = page.locator('button:has-text("删除")')
    if delete_btns.count() > 0:
        log(f"点击删除按钮")
        delete_btns.first.click()
        page.wait_for_timeout(1000)
        page.screenshot(path=f'/tmp/{module_name}_5_delete_confirm.png', full_page=True)

        confirm_btns = page.locator('button:has-text("删除")')
        if confirm_btns.count() > 0:
            confirm_btns.click()
            page.wait_for_timeout(2000)
            page.screenshot(path=f'/tmp/{module_name}_6_after_delete.png', full_page=True)
            log("✓ 删除操作完成")
        else:
            cancel_btns = page.locator('button:has-text("取消")')
            if cancel_btns.count() > 0:
                cancel_btns.click()
                page.wait_for_timeout(500)
                log("已取消删除")
    else:
        report_issue(f"{module_name}: 未找到删除按钮")

    log(f"✓ {module_name} 模块测试完成")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        errors = []
        page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)
        page.on('pageerror', lambda err: report_issue(f"页面错误: {str(err)[:100]}"))

        log("访问师生管理系统...")
        page.goto(f'{BASE_URL}/student-management')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(3000)

        page.screenshot(path='/tmp/main_page.png', full_page=True)

        modules = ['学员档案', '老师档案', '班级档案']
        for module in modules:
            test_module(page, module)

        browser.close()

        log("\n" + "=" * 60)
        log("测试结果总结")
        log("=" * 60)

        if ISSUES:
            log(f"\n发现的问题 ({len(ISSUES)}):")
            for issue in ISSUES:
                print(f"  ✗ {issue}")
        else:
            log("\n✓ 未发现明显问题")

        if errors:
            log(f"\n浏览器控制台错误 ({len(errors)}):")
            for e in errors[:10]:
                print(f"  - {e[:100]}")

        log("\n截图已保存到 /tmp/ 目录")
        log("\n建议：查看截图文件来分析UI问题")

if __name__ == '__main__':
    main()