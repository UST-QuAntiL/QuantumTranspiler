import importlib


# Changes the global scope to restrict importing and returns it to work with in other environments
def get_custom_builtins():

    # https://stackoverflow.com/questions/1350466/preventing-python-code-from-importing-certain-modules
    def select_importer(name, globals=None, locals=None, fromlist=(), level=0):
        restricted_modules = ["os", "sys", "importlib"]
        if name in restricted_modules:
            raise ImportError("module '%s' is restricted." % name)

        return importlib.__import__(name, globals, locals, fromlist, level)

    __builtins__["__import__"] = select_importer
    return __builtins__
