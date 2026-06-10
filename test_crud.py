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

def discover_page(page):
    log("=" * 60)
    log("页面元素发现")
    log("=" * 60)

    buttons = page.locator('button').all()
    log(f"页面按钮 ({len(buttons)}):")
    for btn in buttons:
        try:
            text = btn.inner_text()
            log(f"  - [{text[:30]}]")
        except:
            pass

    inputs = page.locator('input').all()
    log(f"输入框 ({len(inputs)}):")
    for inp in inputs:
        try:
            log(f"  - type={inp.get_attribute('type')}, placeholder={inp.get_attribute('placeholder')}")
        except:
            pass

    selects = page.locator('select').all()
    log(f"下拉框 ({len(selects)}):")
    for sel in selects:
        try:
            opts = sel.locator('option').all()
            log(f"  - 选项数: {len(opts)}")
        except:
            pass

    page.screenshot(path='/tmp/discovery.png', full_page=True)

def test_add_form(page):
    log("\n" + "=" * 60)
    log("测试添加表单")
    log("=" * 60)

    add_btns = page.locator('button').all()
    add_btn = None
    for btn in add_btns:
        try:
            text = btn.inner_text()
            if '添加' in text or '新增' in text or 'add' in text.lower():
                add_btn = btn
                log(f"找到添加按钮: [{text}]")
                break
        except:
            pass

    if add_btn:
        add_btn.click()
        page.wait_for_timeout(1500)
        page.screenshot(path='/tmp/add_form.png', full_page=True)

        inputs = page.locator('input:visible').all()
        log(f"可见输入框: {len(inputs)}")

        submit_btns = page.locator('button:has-text("保存")')
        if submit_btns.count() > 0:
            log("找到保存按钮")
            submit_btns.click()
            page.wait_for_timeout(2000)
            page.screenshot(path='/tmp/after_submit.png', full_page=True)
            log("✓ 提交表单")
        else:
            report_issue("未找到保存按钮，尝试点击最后一个按钮")
            btns = page.locator('button:visible').all()
            if len(btns) > 1:
                btns[-1].click()
                page.wait_for_timeout(2000)

def test_edit_form(page):
    log("\n" + "=" * 60)
    log("测试编辑表单")
    log("=" * 60)

    edit_btns = page.locator('button:has-text("编辑")')
    if edit_btns.count() > 0:
        log(f"找到 {edit_btns.count()} 个编辑按钮")
        edit_btns.first.click()
        page.wait_for_timeout(1500)
        page.screenshot(path='/tmp/edit_form.png', full_page=True)
        log("✓ 编辑表单已打开")

        close_btns = page.locator('button:has-text("取消")')
        if close_btns.count() > 0:
            close_btns.click()
            page.wait_for_timeout(500)
            log("✓ 已关闭编辑表单")
    else:
        report_issue("未找到编辑按钮")

def test_delete(page):
    log("\n" + "=" * 60)
    log("测试删除功能")
    log("=" * 60)

    delete_btns = page.locator('button:has-text("删除")')
    if delete_btns.count() > 0:
        log(f"找到 {delete_btns.count()} 个删除按钮")
        delete_btns.first.click()
        page.wait_for_timeout(1000)
        page.screenshot(path='/tmp/delete_confirm.png', full_page=True)

        confirm_btns = page.locator('button:has-text("确认")')
        if confirm_btns.count() > 0:
            log("找到确认删除按钮，点击...")
            confirm_btns.click()
            page.wait_for_timeout(2000)
            page.screenshot(path='/tmp/after_delete.png', full_page=True)
            log("✓ 删除操作完成")
        else:
            cancel_btns = page.locator('button:has-text("取消")')
            if cancel_btns.count() > 0:
                cancel_btns.click()
                page.wait_for_timeout(500)
                log("已取消删除")
    else:
        report_issue("未找到删除按钮")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        errors = []
        page.on('console', lambda msg: errors.append(f"[{msg.type}] {msg.text}") if 'error' in msg.type else None)
        page.on('pageerror', lambda err: report_issue(f"页面错误: {err}"))

        log("访问师生管理系统...")
        page.goto(f'{BASE_URL}/student-management')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(3000)

        discover_page(page)

        log("\n" + "=" * 60)
        log("模块切换测试")
        log("=" * 60)

        module_btns = page.locator('button').all()
        modules_found = []
        for btn in module_btns:
            try:
                text = btn.inner_text()
                if any(m in text for m in ['学员', '老师', '班级', '考勤', '缴费', '学员档案', '老师档案', '班级档案']):
                    modules_found.append(btn)
                    log(f"找到模块按钮: [{text}]")
            except:
                pass

        if modules_found:
            log(f"共找到 {len(modules_found)} 个模块按钮")
            for i, btn in enumerate(modules_found[:5]):
                try:
                    text = btn.inner_text()
                    log(f"切换到: {text}")
                    btn.click()
                    page.wait_for_timeout(2000)
                    page.screenshot(path=f'/tmp/module_{i}.png', full_page=True)
                except Exception as e:
                    report_issue(f"切换模块失败: {str(e)}")
        else:
            report_issue("未找到任何模块切换按钮")

        test_add_form(page)
        test_edit_form(page)
        test_delete(page)

        browser.close()

        log("\n" + "=" * 60)
        log("测试结果总结")
        log("=" * 60)
        for r in RESULTS:
            print(r)

        if ISSUES:
            log(f"\n发现的问题 ({len(ISSUES)}):")
            for issue in ISSUES:
                print(f"  ✗ {issue}")

        if errors:
            log(f"\n浏览器控制台错误 ({len(errors)}):")
            for e in errors[:10]:
                print(f"  - {e}")

if __name__ == '__main__':
    main()