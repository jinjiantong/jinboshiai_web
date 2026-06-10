from playwright.sync_api import sync_playwright

BASE_URL = 'http://localhost:3000'

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        console_logs = []
        page.on('console', lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
        page.on('pageerror', lambda err: console_logs.append(f"[pageerror] {err}"))

        print("=" * 60)
        print("测试学员档案编辑功能")
        print("=" * 60)
        page.goto(f'{BASE_URL}/student-management')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(3000)

        # 切换到学员档案
        page.click('button:has-text("学员档案")')
        page.wait_for_timeout(3000)

        # 检查是否有学员数据
        page_text = page.evaluate("() => document.body.innerText")
        print(f"页面包含'李四学员': {'李四学员' in page_text}")

        # 添加测试学员
        if '李四学员' not in page_text:
            print("\n添加测试学员...")
            page.click('button:has-text("添加")')
            page.wait_for_timeout(2000)

            page.evaluate("""() => {
                const input = document.querySelector('input');
                if (input) {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                    nativeInputValueSetter.call(input, '李四学员');
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }""")

            page.evaluate("""() => {
                const form = document.querySelector('form');
                if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }""")
            page.wait_for_timeout(5000)

            page.reload()
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(3000)
            page.click('button:has-text("学员档案")')
            page.wait_for_timeout(3000)

        # 点击编辑按钮
        print("\n点击编辑按钮...")
        page.evaluate("""() => {
            const lastCell = document.querySelector('tbody tr td:last-child');
            if (lastCell) {
                const editBtn = lastCell.querySelector('button.text-blue-600');
                if (editBtn) editBtn.click();
            }
        }""")
        page.wait_for_timeout(2000)

        # 检查表单内容
        form_info = page.evaluate("""() => {
            const selects = Array.from(document.querySelectorAll('select'));
            const result = {};
            selects.forEach((s, i) => {
                const label = s.closest('div')?.querySelector('label')?.innerText || '未知' + i;
                const selectedOption = s.options[s.selectedIndex];
                result[label] = {
                    value: s.value,
                    text: selectedOption?.text || '无'
                };
            });
            return result;
        }""")

        print("\n表单下拉框状态:")
        for label, info in form_info.items():
            print(f"  {label}: {info['text']}")

        # 关闭模态框
        page.click('button:has-text("取消")')
        page.wait_for_timeout(1000)

        # 检查控制台错误
        print("\n检查控制台错误...")
        errors = [log for log in console_logs if '[error]' in log or '[pageerror]' in log]
        if errors:
            print(f"发现 {len(errors)} 个错误:")
            for e in errors[:3]:
                print(f"  {e[:200]}")
        else:
            print("✓ 无控制台错误")

        browser.close()
        print("\n测试完成")

if __name__ == '__main__':
    main()